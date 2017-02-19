import * as mod from "object-mapper";
import { IMapFactory, IMapping, IKeyDefinition, IMapData } from "./interfaces";
import Mapping from "./mapping";

const objectMapper: any = mod;

export default class Mapper {

  public assignment: IMapping[] = [];
  private mapCache: IMapData = null;

  registerMapping(mapping: IMapping) {

    this.assignment.push(mapping);
  }

  public map(source: string | string[]) {

    const mapping = new Mapping(source, this);
    this.registerMapping(mapping);

    return mapping;

  }

  public each(sourceArray: any[]) {

    if (sourceArray === null || sourceArray === undefined) {
      throw new Error("A sourceArray object is required");
    }

    if (Array.isArray(sourceArray) !== true) {
      throw new Error("The sourceArray parameter must be an array");
    }

    return sourceArray.map(item => {
      return this.execute(item, null);
    });

  }

  public execute(source, destination) {

    if (source === null || source === undefined) {
      throw new Error("A source object is required");
    }

    if (destination === null || destination === undefined) {
      destination = {};
    }

    if (this.mapCache === null) {
      this.mapCache = this.createMapData();
    }

    const output = objectMapper(source, destination, this.mapCache.transform);

    return this.appendMultiSelections(source, output, this.mapCache.multiMaps);
  }

  private createMapData(): IMapData {

    const mapData = {
      transform: {},
      multiMaps: []
    };

    for (const item of this.assignment) {

      const sourceKey: any = item.source;
      let mapDetail: any = item.target;

      if (Array.isArray(item.source)) {

        // transforms are optional in orMode
        if (!item.transform && item.orMode === false) {
          throw new Error("Multiple selections must map to a transform. No transform provided.");
        }

        mapData.multiMaps.push(item);
        continue;
      }

      if (!mapDetail) {
        mapDetail = sourceKey;
      }

      if (item.transform) {
        mapDetail = {
          key: mapDetail,
          transform: item.transform
        };
      }

      if (mapData.transform[sourceKey] === undefined) {
        mapData.transform[sourceKey] = [];
      }

      mapData.transform[sourceKey].push(mapDetail);
    }

    return mapData;
  }

  private appendMultiSelections(source, target, multiMaps: IMapping[]) {

    let output = target;

    for (const item of multiMaps) {

      const params = [];

      // this multi-select is be processed in orMode
      if (item.orMode) {

        output = this.applyOrMode(item, source, output);
        continue;
      }

      const sourceArray: any = item.source;

      // normal mode
      for (const sourceKey of sourceArray) {

        const value = objectMapper.getKeyValue(source, sourceKey);
        params.push(value);
      }

      const result = item.transform.apply(null, params);
      output = objectMapper.setKeyValue(output, item.target, result);
    }

    return output;
  }

  private applyOrMode(item: IMapping, source, output) {

    let orValue = null;
    const sourceArray: any = item.source;

    for (const sourceKey of sourceArray) {

      orValue = objectMapper.getKeyValue(source, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }
    }

    // no transform
    if (item.transform === undefined) {

      output = objectMapper.setKeyValue(output, item.target, orValue);
      return output;
    }

    // has a transform
    const params = [];
    params.push(orValue);

    const result = item.transform.apply(null, params);
    output = objectMapper.setKeyValue(output, item.target, result);
    return output;
  }

}
