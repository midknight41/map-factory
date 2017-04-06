import ported from "./object-mapper/object-mapper";
import Mapper from "./mapper";

export default function createMapper(options) {

  const opts = options || {};

  // v1 will default as below but the reverse will be true in v2
  opts.alwaysSet = typeof opts.alwaysSet === "boolean" ? opts.alwaysSet : true;
  opts.alwaysTransform = typeof opts.alwaysTransform === "boolean" ? opts.alwaysTransform : true;
  opts.experimental = typeof opts.experimental === "boolean" ? opts.experimental : false;

  const me = {
    mapper: new Mapper(opts, ported)
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
