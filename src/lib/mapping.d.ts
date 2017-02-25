import { IMapping } from "./interfaces";
export default class Mapping implements IMapping {
    source: string | string[];
    target: string;
    transform: Function;
    mapper: any;
    orMode: boolean;
    constructor(source: string | string[], mapper: any);
    map(stringOrArray: string | string[]): any;
    or(source: string): this;
    execute(source?: any, destination?: any): any;
    each(sourceArray: any): any;
    to(target: string, fnc?: Function): any;
}
