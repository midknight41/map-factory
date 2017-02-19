import { IMapping, IKeyDefinition } from "./interfaces";

export default class Mapping implements IMapping {

  public source: string | string[];
  public target: string; //  | IKeyDefinition;
  public transform: Function;
  public mapper: any;
  public orMode: boolean = false;

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

  public or(source: string) {

    if (!source) {
      throw new Error("'source' is required for the 'or' method");
    }

    if (Array.isArray(source)) {
      throw new Error("The 'or' method can only be used with single selections");
    }

    if (Array.isArray(this.source) && this.orMode === false) {
      throw new Error("The 'or' method can only be used with single selections");
    }

    this.orMode = true;

    if (Array.isArray(this.source)) {

      const sourceArray: any = this.source;

      sourceArray.push(source);


      return this;
    }

    const newSource = [];
    newSource.push(this.source);
    newSource.push(source);

    this.source = newSource;

    return this;

  }

  public execute(source?, destination?) {
    return this.mapper.execute(source, destination);
  }

  public each(sourceArray) {
    return this.mapper.each(sourceArray);
  }

  public to(target: string, fnc?: Function) {

    if (!target) {
      throw new Error("the target field name cannot be null");
    }

    this.target = target;

    if (fnc) {
      this.transform = fnc;
    }

    return this.mapper;


  }

}
