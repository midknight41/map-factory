import { IMapping } from "./interfaces";
import Mapping from "./mapping";
export default class Mapper {
    assignment: IMapping[];
    private mapCache;
    registerMapping(mapping: IMapping): void;
    map(source: string | string[]): Mapping;
    each(sourceArray: any[]): any[];
    execute(source: any, destination: any): any;
    private createMapData();
    private appendMultiSelections(source, target, multiMaps);
    private applyOrMode(item, source, output);
}
