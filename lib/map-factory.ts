import * as mod from "object-mapper";

const objectMapper: any = mod;

interface IMapFactory {
  (obj: any): Mapping;
  execute();
}

export default function createMapper(obj: any): IMapFactory {

  const me: any = {
    assignment: []
  };

  const map: IMapFactory = function map(source: string): Mapping {
  
    this.sourceObject = obj;

    const mapping = new Mapping(source);
    this.assignment.push(mapping);

    return mapping;

  }.bind(me);

  map.execute = function () {

    const transform = {};

    for (const item of this.assignment) {

      if (!item.target) item.target = item.source;

      transform[item.source] = item.target;
    }

    return objectMapper(me.sourceObject, transform);

  }.bind(me);

  return map;

}

class Mapping {

  public source: string;
  public target: string | IKeyDefinition;

  constructor(source: string) {

    if (!source) throw new Error("the source field name cannot be null");

    this.source = source;
  }

  public to(target: string, fnc?: Function) {

    if (!target) throw new Error("the target field name cannot be null");

    if (fnc) {

      this.target = {
        key: target,
        transform: fnc
      }

      return;
    }

    this.target = target;
  }

}

interface IKeyDefinition {
  key: string;
  transform: Function;
}