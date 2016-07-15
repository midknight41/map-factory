export interface IMapFactory {
    (stringOrArray: string | string[]): IMapping;
    execute(): any;
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
