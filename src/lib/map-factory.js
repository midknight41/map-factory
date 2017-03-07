import ported from "./object-mapper/object-mapper";
import original from "object-mapper";
import Mapper from "./mapper";

export default function createMapper(options) {

  const opts = options || {};
  const om = (opts.experimental) ? ported : original;

  const me = {
    mapper: new Mapper(opts.experimental, om)
  };

  const mapper = function map(source) {

    return this.mapper.map(source);

  }.bind(me);

  mapper.map = function (source) {

    return this.mapper.map(source);

  }.bind(me);

  mapper.execute = function (source, destination) {
    return this.mapper.execute(source, destination);
  }.bind(me);

  mapper.each = function (sourceArray) {
    return this.mapper.each(sourceArray);
  }.bind(me);

  return mapper;
}
