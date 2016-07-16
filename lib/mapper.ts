import * as mod from "object-mapper";
import {IMapFactory, IMapping, IKeyDefinition, IMapData} from "./interfaces";

const objectMapper: any = mod;

export default class Mapper {

  public assignment: IMapping[] = [];
  public sourceObject: Object = new Object();
  private mapCache: IMapData = null;

  constructor(obj) {
    this.sourceObject = obj;
  }

  registerMapping(mapping: IMapping) {
    this.assignment.push(mapping);
  }

  public execute(sourceObject?) {

    if (sourceObject === null || sourceObject === undefined) {
      sourceObject = this.sourceObject;
    }


    if (this.mapCache === null) {
      this.mapCache = this.createMapData();
    } 
    
    const output = objectMapper(sourceObject, {}, this.mapCache.transform);

    return this.appendMultiSelections(sourceObject, output, this.mapCache.multiMaps);

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

        if (!target.transform) throw new Error("Multiple selections must map to a transform. No transform provided.");

        mapData.multiMaps.push(item);
        continue;
      };

      if (!target) target = sourceKey;

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
