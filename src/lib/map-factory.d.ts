import { IMapFactory, IOptions } from "./interfaces";
export { IMapFactory, IOptions };
export default function createMapper(options?: IOptions): IMapFactory;
export function setValue(baseObject: any, destinationKey: string, fromValue: any): any;
export function getValue(fromObject: any, fromKey: string): any;
