
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

  each(sourceArray) {
    return this.mapper.each(sourceArray);
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

}
