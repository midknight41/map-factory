import * as mod from "object-mapper";
import {IMapFactory, IMapping, IKeyDefinition} from "./interfaces";

const objectMapper: any = mod;

export default class Mapper {

  public assignment: IMapping[] = [];
  public sourceObject: Object = new Object();

  constructor(obj) {
    this.sourceObject = obj;
  }

  registerMapping(mapping: IMapping) {
    this.assignment.push(mapping);
  }

  public execute() {

    const transform = {};
    const multiMaps = [];

    for (const item of this.assignment) {

      const sourceKey: any = item.source;
      let target: any = item.target;

      if (Array.isArray(item.source)) {

        if (!target.transform) throw new Error("Multiple selections must map to a transform. No transform provided.");

        multiMaps.push(item);
        continue;
      };

      if (!target) target = sourceKey;

      transform[sourceKey] = target;

    }

    const output = objectMapper(this.sourceObject, {}, transform);

    return this.appendMultiSelections(this.sourceObject, output, multiMaps);

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
