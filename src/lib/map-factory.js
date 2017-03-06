import ported from "./object-mapper/object-mapper";
import original from "object-mapper";
import Mapper from "./mapper";

export default function createMapper(options) {

  let om = original;
  let experimental = false;
  if (!options) options = {};

  if (options.experimental) {
    om = ported;
    experimental = true;
  }

  const me = {
    mapper: new Mapper(experimental, om)
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
