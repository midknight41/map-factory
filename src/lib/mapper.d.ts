import { IMapping, IMapFactory } from "./interfaces";
import Mapping from "./mapping";
export default class Mapper {
    constructor(options, om);
    assignment: IMapping[];
    private mapCache;
    registerMapping(mapping: IMapping): void;
    map(source?: string | string[]): Mapping;
    set(key: string, value: any): Mapping;
    each(sourceArray: any[]): any[];
    execute(source: any, destination: any): any;
    executeAsync(source: any, destination: any): Promise<any>;
    chain(mapper: IMapFactory):IMapFactory;
    private createMapData();
    private appendMultiSelections(source, target, multiMaps);
    private applyOrMode(item, source, output);
}
