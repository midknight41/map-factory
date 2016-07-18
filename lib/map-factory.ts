import * as mod from "object-mapper";
import {IMapFactory, IMapping} from "./interfaces";
import Mapper from "./mapper";
import Mapping from "./mapping";

export default function createMapper(): IMapFactory {

  const me = {
    mapper: new Mapper()
  };

  const map: IMapFactory = function map(source: string | string[]): IMapping {

    const mapping = new Mapping(source);
    this.mapper.registerMapping(mapping);

    return mapping;

  }.bind(me);

  map.execute = function (source?, destination?) {
    return this.mapper.execute(source, destination);
  }.bind(me);

  return map;

}
