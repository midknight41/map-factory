import ported from "./object-mapper/object-mapper";
import Mapper from "./mapper";

export default function createMapper(options) {

  const opts = options || {};

  // flatten defaults to null which means will make the decision to flatten by itself
  const permittedOptions = ["flatten", "flattenInverted", "alwaysSet", "alwaysTransform"];
  const defaultValues = [null, false, false, false];

  for (let i = 0; i < permittedOptions.length; i++) {
    const option = permittedOptions[i];
    opts[option] = typeof opts[option] === "boolean" ? opts[option] : defaultValues[i];
  }

  // opts.alwaysSet = typeof opts.alwaysSet === "boolean" ? opts.alwaysSet : false;
  // opts.alwaysTransform = typeof opts.alwaysTransform === "boolean" ? opts.alwaysTransform : false;
  // opts.experimental = typeof opts.experimental === "boolean" ? opts.experimental : false;
  // opts.flatten = typeof opts.flatten === "boolean" ? opts.flatten : false;
  // opts.flattenInverted = typeof opts.flattenInverted === "boolean" ? opts.flattenInverted : false;

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

  mapper.executeAsync = function (source, destination) {
    return this.mapper.executeAsync(source, destination);
  }.bind(me);

  mapper.each = function (sourceArray) {
    return this.mapper.each(sourceArray);
  }.bind(me);

  mapper.chain = function (secondaryMapper) {
    return this.mapper.chain(secondaryMapper);
  }.bind(me);

  return mapper;
}
