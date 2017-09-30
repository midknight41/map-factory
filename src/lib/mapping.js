import cloneDeep from "lodash.clonedeep";
import unset from "lodash.unset";

export default class Mapping {

  constructor(source, mapper, options) {

    if (!source) {
      throw new Error("the source field name cannot be null");
    }

    this.mapper = mapper;
    this.source = source;
    this.orMode = false;
    this.alwaysSet = options.alwaysSet;
    this.alwaysTransform = options.alwaysTransform;
    this.flatten = options.flatten;
    this.flattenInverted = options.flattenInverted;
    this.pipelineTransformations = [];

  }

  get always() {
    this.alwaysSet = true;
    this.alwaysTransform = true;
    return this;
  }

  get existing() {
    this.alwaysSet = false;
    this.alwaysTransform = false;
    return this;
  }

  with(optionOverrides) {

    const permittedOptions = ["flatten", "flattenInverted", "alwaysSet", "alwaysTransform"];

    for (const option of permittedOptions) {
      this[option] = optionOverrides[option] === undefined ? this[option] : optionOverrides[option];

    }

    return this;
  }

  map(stringOrArray) {
    return this.mapper.map(stringOrArray);
  }

  or(source) {

    if (!source) {
      throw new Error("'source' is required for the 'or' method");
    }

    if (Array.isArray(source)) {
      throw new Error("The 'or' method can only be used with single selections");
    }

    if (Array.isArray(this.source) && this.orMode === false) {
      throw new Error("The 'or' method can only be used with single selections");
    }

    this.orMode = true;

    if (Array.isArray(this.source)) {

      const sourceArray = this.source;

      sourceArray.push(source);

      return this;
    }

    const newSource = [];
    newSource.push(this.source);
    newSource.push(source);

    this.source = newSource;

    return this;

  }

  execute(source, destination) {
    return this.mapper.execute(source, destination);
  }

  executeAsync(source, destination) {
    return this.mapper.executeAsync(source, destination);
  }

  each(sourceArray) {
    return this.mapper.each(sourceArray);
  }

  chain(mapper) {
    return this.mapper.chain(mapper);
  }

  to(target, fnc) {

    if (!target || typeof target !== "string") {
      throw new Error("the target field name must be a string");
    }

    this.target = target;

    if (fnc) {
      this.transform = fnc;
    }

    return this.mapper;

  }

  removing(keys) {

    if (Array.isArray(keys) && keys.length > 0) {
      keys.map(key => {
        if (typeof key !== "string") {
          throw new Error("The removing method requires a string value or an array of strings");
        }

      });
    }

    if (Array.isArray(keys) === false && typeof keys !== "string") {
      throw new Error("The removing method requires a string value or an array of strings");
    }

    this.pipelineTransformations.push(value => {

      let valueToUse = cloneDeep(value);

      if (typeof valueToUse !== "object" && !Array.isArray(valueToUse)) {
        return valueToUse;
      }

      const isArray = Array.isArray(valueToUse) && valueToUse.length > 0;

      if (isArray) {
        valueToUse = valueToUse.map(val => {
          if (typeof val !== "object" && !Array.isArray(val)) {
            return val;
          }
          return this.processRemoving_(keys, val);
        });
      } else {
        valueToUse = this.processRemoving_(keys, valueToUse);
      }
      return valueToUse;
    });

    return this;
  }

  processRemoving_(keys, val) {

    if (Array.isArray(keys) && keys.length > 0) {
      keys.map(key => {
        unset(val, key);
      });

      return val;
    }

    if (typeof keys === "string") {
      unset(val, keys);
      return val;
    }

  }


}
