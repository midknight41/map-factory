import { IMapping, IKeyDefinition } from "./interfaces";
export default class Mapping implements IMapping {
    source: string | string[];
    target: string | IKeyDefinition;
    constructor(source: string | string[]);
    to(target: string, fnc?: Function): void;
}
