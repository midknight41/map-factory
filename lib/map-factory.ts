import * as mod from "object-mapper";
import Mapper from "./mapper";
import Mapping from "./mapping";
import {IMapFactory, IMapping} from "./interfaces";

export default function createMapper(): IMapFactory {

  const me = {
    mapper: new Mapper()
  };

  const mapper: IMapFactory = function map(source: string | string[]): IMapping {

    const mapping = new Mapping(source);
    this.mapper.registerMapping(mapping);

    return mapping;

  }.bind(me);

  mapper.map = function (source: string | string[]): IMapping {

    const mapping = new Mapping(source);
    this.mapper.registerMapping(mapping);

    return mapping;

  }.bind(me);

  mapper.execute = function (source?, destination?) {
    return this.mapper.execute(source, destination);
  }.bind(me);

  return mapper;
}
