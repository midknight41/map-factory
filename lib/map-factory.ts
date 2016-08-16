import Mapper from "./mapper";
import {IMapFactory, IMapping} from "./interfaces";

export default function createMapper(): IMapFactory {

  const me = {
    mapper: new Mapper()
  };

  const mapper: IMapFactory = function map(source: string | string[]): IMapping {

    return this.mapper.map(source);

  }.bind(me);

  mapper.map = function (source: string | string[]): IMapping {

    return this.mapper.map(source);

  }.bind(me);

  mapper.execute = function (source?, destination?) {
    return this.mapper.execute(source, destination);
  }.bind(me);

  mapper.each = function (sourceArray?) {
    return this.mapper.each(sourceArray);
  }.bind(me);

  return mapper;
}
