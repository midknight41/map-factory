import * as mod from "object-mapper";
import {IMapFactory, IMapping, IKeyDefinition, IMapData} from "./interfaces";
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

        if (!target.transform) {
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

      for (const sourceKey of item.source) {

        const value = objectMapper.getKeyValue(source, sourceKey);
        params.push(value);
      }

      const result = item.target.transform.apply(null, params);
      output = objectMapper.setKeyValue(output, item.target.key, result);
    }

    return output;
  }
}
