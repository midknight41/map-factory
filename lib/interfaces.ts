
export interface IMapFactory {
  (stringOrArray: string | string[]): IMapping;
  execute();
}

export interface IMapping {
  source: string | string[];
  target: string | IKeyDefinition;
  to(target: string, fnc?: Function);
}


export interface IKeyDefinition {
  key: string;
  transform: Function;
}