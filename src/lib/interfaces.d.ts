export interface IKeyDefinition {
    key: string;
    transform: Function;
}
export interface IMapData {
    transform: Object;
    multiMaps: IMapping[];
}
export interface IMapFactory {
    (stringOrArray: string | string[]): IMapping;
    map(stringOrArray?: string | string[]): IMapping;
    execute(source: any, destination?: any): any;
    executeAsync(source: any, destination?: any): Promise<any>;
    each(sourceArray: any[]): any;
    chain(mapper: IMapFactory):IMapFactory;
}
export interface IMapping {
    orMode: boolean;
    source: string | string[];
    target: string;
    transform?: Function;
    to(target: string, fnc?: Function): any;
    map(stringOrArray?: string | string[]): IMapping;
    or(source: string): any;
    execute(source: any, destination?: any): any;
    executeAsync(source: any, destination?: any): Promise<any>;
    each(sourceArray: any[]): any;
    chain(mapper: IMapFactory): IMapFactory;
    each(sourceArray: any): any;
    to(target: string, successFunc?: Function, notFoundFunc? : any): any;
    always: IMapping;
    existing: IMapping;
    removing(keys: string | string[]): IMapping;
    keep(keys: string | string[]): IMapping;
    acceptIf(key: string, comparison: any): IMapping;
    rejectIf(key: string, comparison: any): IMapping;
    sort(comparer?: Function): IMapping;
    reverseSort(comparer?: Function): IMapping;
    set(target: string, value: any): IMapping;
}
export interface IOptions {
  experimental?: boolean;
  alwaysTransform?: boolean;
  alwaysSet?: boolean;
  failureTransform?: Function
}
