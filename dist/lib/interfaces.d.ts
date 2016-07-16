export interface IMapFactory {
    (stringOrArray: string | string[]): IMapping;
    execute(obj?: any): any;
}
export interface IMapping {
    source: string | string[];
    target: string | IKeyDefinition;
    to(target: string, fnc?: Function): any;
}
export interface IKeyDefinition {
    key: string;
    transform: Function;
}
export interface IMapData {
    transform: Object;
    multiMaps: Object[];
}
