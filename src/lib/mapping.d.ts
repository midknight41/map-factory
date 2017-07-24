import { IMapping, IMapFactory } from "./interfaces";
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
  executeAsync(source?: any, destination?: any): Promise<any>;
  chain(mapper: IMapFactory):IMapFactory;
  each(sourceArray: any): any;
  to(target: string, fnc?: Function): any;
  always: IMapping;
  existing: IMapping;
  removing(keys: string | string[]): IMapping;
}
