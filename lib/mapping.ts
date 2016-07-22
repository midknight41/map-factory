import {IMapping, IKeyDefinition} from "./interfaces";

export default class Mapping implements IMapping {

  public source: string | string[];
  public target: string | IKeyDefinition;
  public mapper: any;

  constructor(source: string | string[], mapper) {

    if (!source) {
      throw new Error("the source field name cannot be null");
    }

    this.mapper = mapper;
    this.source = source;

  }

  public map(stringOrArray: string | string[]) {
    return this.mapper.map(stringOrArray);
  }

  public execute(source?, destination?) {
    return this.mapper.execute(source, destination);
  }

  public to(target: string, fnc?: Function) {

    if (!target) {
      throw new Error("the target field name cannot be null");
    }

    if (fnc) {

      this.target = {
        key: target,
        transform: fnc
      };

      return this.mapper;
    }

    this.target = target;

    return this.mapper;


  }

}
