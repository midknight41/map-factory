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
      let target: any = item.target;

      if (Array.isArray(item.source)) {

        // transforms are optional in orMode
        if (!target.transform && item.orMode === false) {
          throw new Error("Multiple selections must map to a transform. No transform provided.");
        }

        mapData.multiMaps.push(item);
        continue;
      }

      if (!target) {
        target = sourceKey;
      }

      mapData.transform[sourceKey] = target;
    }

    return mapData;
  }

  private appendMultiSelections(source, target, multiMaps) {

    let output = target;

    for (const item of multiMaps) {

      const params = [];

      // this multi-select is be processed in orMode
      if (item.orMode) {

        output = this.applyOrMode(item, source, output);
        continue;
      }

      // normal mode
      for (const sourceKey of item.source) {

        const value = objectMapper.getKeyValue(source, sourceKey);
        params.push(value);
      }

      const result = item.target.transform.apply(null, params);
      output = objectMapper.setKeyValue(output, item.target.key, result);
    }

    return output;
  }

  private applyOrMode(item, source, output) {

    let orValue = null;

    for (const sourceKey of item.source) {

      orValue = objectMapper.getKeyValue(source, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }
    }

    // TODO: transform logic is messy. Could add a hasTransform to the Mapping to tidy it.

    // no transform
    if (item.target.key === undefined) {

      output = objectMapper.setKeyValue(output, item.target, orValue);
      return output;
    }

    // has a transform
    const params = [];
    params.push(orValue);

    const result = item.target.transform.apply(null, params);
    output = objectMapper.setKeyValue(output, item.target.key, result);
    return output;
  }

}
