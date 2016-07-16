import { IMapping } from "./interfaces";
export default class Mapper {
    assignment: IMapping[];
    sourceObject: Object;
    private mapCache;
    constructor(obj: any);
    registerMapping(mapping: IMapping): void;
    execute(sourceObject?: any): any;
    private createMapData();
    private appendMultiSelections(source, target, multiMaps);
}
