export interface IKeyDefinition {
  key: string;
  transform: Function;
}

export interface IMapData {
  transform: Object;
  multiMaps: Object[];
}
export interface IMapFactory {
  (stringOrArray: string | string[]): IMapping;
  map(stringOrArray: string | string[]): IMapping;
  execute(source?, destination?);
}

export interface IMapping {
  source: string | string[];
  target: string | IKeyDefinition;
  to(target: string, fnc?: Function);
  map(stringOrArray: string | string[]): IMapping;
  execute(source?, destination?);

}
