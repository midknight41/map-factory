import {IMapping, IKeyDefinition} from "./interfaces";

export default class Mapping implements IMapping {

  public source: string | string[];
  public target: string | IKeyDefinition;
  
  constructor(source: string | string[]) {

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
