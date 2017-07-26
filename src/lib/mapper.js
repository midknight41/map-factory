import Mapping from "./mapping";
// import getValue from "./object-mapper/get-key-value";
// import setValue from "./object-mapper/set-key-value";

const SINGLE_MODE = 0;
const MULTI_MODE = 1;
const OR_MODE = 2;

const isValueArray = new RegExp(/^\[\]|\[\d+\]/);

export default class Mapper {

  constructor(opts, om) {

    this.om = om;
    this.experimental = opts.experimental;
    this.options = opts;

    this.assignment = [];
    this.mapCache_ = null;

    this.chainArray = [];

  }

  registerMapping_(mapping) {

    this.assignment.push(mapping);
  }


  map(source) {

    // create a mapping for a single or multiple source field(s) and return the mapping object
    // the mapping object enables the fluent/chainable interface

    const mapping = new Mapping(source, this, this.options);
    this.registerMapping_(mapping);

    return mapping;

  }

  each(sourceArray) {

    // validate inputs
    if (!sourceArray) {
      // TODO: This should probably return undefined
      return null;
    }

    if (Array.isArray(sourceArray) !== true) {
      throw new Error("The sourceArray parameter must be an array");
    }

    // iterate over an array of values and map each one
    return sourceArray.map(item => {
      return this.execute(item, null);
    });
  }

  execute(source, destination) {

    // validate inputs
    if (source === null || source === undefined) {
      throw new Error("A source object is required");
    }

    // ensure we have a destination object to target
    if (destination === null || destination === undefined) {
      destination = {};
    }

    for (const item of this.assignment) {

      // TODO: This method should be done at map declaration not at execution
      const descriptor = this.getTransformDescriptor_(item);

      // annoyingly, VS Code's auto format is at odds with eslint
      /* eslint-disable indent */

      // map-factory supports 3 modes:
      // - single source mode -> mapper.map("field1")
      // - multiple sources mode -> mapper.map(["field1", "field2"])
      // - or mode -> mapper.map("field1").or("field2")

      // Here we just route the mode to the appropriate logic
      switch (descriptor.mode) {
        case SINGLE_MODE:
          destination = this.processSingleItem_(source, destination, descriptor);
          break;
        case MULTI_MODE:
          destination = this.processMultiItem_(source, destination, descriptor);
          break;
        case OR_MODE:
          destination = this.processOrItem_(source, destination, descriptor);
          break;
        default:
          throw new Error(`Invalid Mapping Mode: mode was ${descriptor.mode}`);
      }
      /* eslint-enable indent */

    }

    if (this.chainArray.length > 0) {
      this.chainArray.map(item => {
        destination = item.execute(destination);
      });
    }

    return destination;
  }

  executeAsync(source, destination) {
    return Promise.resolve()
      .then(() => this.execute(source, destination));
  }

  chain(mapper) {
    if (mapper === null || mapper === undefined) {
      throw new Error("mapper passed in chain can neither be null or undefined");
    }
    this.chainArray.push(mapper);
    return this;
  }

  getTransformDescriptor_(item) {

    /* eslint-disable prefer-const */
    const sourcePath = item.source;
    let targetPath = item.target;
    let { transform, alwaysSet, alwaysTransform, pipelineTransformations } = item;
    let isCustomTransform = true;
    /* eslint-enable prefer-const */

    const mode = this.decideMode_(item);

    // TODO: offload to Mapping declaration
    if (!transform) {
      isCustomTransform = false;
      transform = value => value;
    }

    if (!targetPath) {
      targetPath = sourcePath;
    }

    return { mode, targetPath, sourcePath, transform, isCustomTransform, options: { alwaysSet, alwaysTransform, pipelineTransformations } };

  }

  decideMode_(item) {

    const isArray = Array.isArray(item.source);

    if (isArray === false) {
      return SINGLE_MODE;
    }

    if (isArray === true && item.orMode === false) {
      return MULTI_MODE;
    }

    return OR_MODE;

  }

  processSingleItem_(sourceObject, destinationObject, { targetPath, sourcePath, transform, options }) {

    // Get source
    let value = this.om.getValue(sourceObject, sourcePath);

    // default transformations
    if (this.exists_(value) && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        value = item(value);
      });
    }

    // Apply transform - will become optional
    if (this.exists_(value) || options.alwaysTransform === true) {
      value = transform(value);
    }

    // Set value on destination object
    return this.setIfRequired_(destinationObject, targetPath, value, options);

  }

  processMultiItem_(sourceObject, destinationObject, { sourcePath, targetPath, transform, isCustomTransform, options }) {

    if (isCustomTransform === false) {
      throw new Error("Multiple selections must map to a transform. No transform provided.");
    }

    let values = [];
    let anyValues = false;

    // Get source
    for (const fromKey of sourcePath) {

      const value = this.om.getValue(sourceObject, fromKey);

      if (this.exists_(value)) {
        anyValues = true;
      }

      values.push(value);
    }

    let value;

    // default transformations
    if (anyValues && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        values = item(values);
      });
    }

    // Apply transform if appropriate
    if (anyValues || options.alwaysTransform === true) {
      value = transform(...values);
    }

    // Set value on destination object
    return this.setIfRequired_(destinationObject, targetPath, value, options);

  }

  processOrItem_(sourceObject, destinationObject, { sourcePath, targetPath, transform, isCustomTransform, options }) {

    let orValue;
    const sourceArray = sourcePath;

    for (const sourceKey of sourceArray) {

      orValue = this.om.getValue(sourceObject, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }
    }

    // default transformations
    if (this.exists_(orValue) && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        orValue = item(orValue);
      });
    }

    // no transform
    if (isCustomTransform === false) {

      return this.setIfRequired_(destinationObject, targetPath, orValue, options);
    }

    // has a transform
    if (this.exists_(orValue) || options.alwaysTransform === true) {
      orValue = transform(orValue);
    }

    return this.setIfRequired_(destinationObject, targetPath, orValue, options);

  }

  setIfRequired_(destinationObject, targetPath, value, options) {

    if (this.exists_(value) || options.alwaysSet === true) {
      return this.om.setValue(destinationObject, targetPath, value);
    }

    if (this.isEmptyObject_(destinationObject) && isValueArray.exec(targetPath) !== null) {
      return [];
    }

    return destinationObject;

  }

  isEmptyObject_(object) {
    return typeof object === "object" &&
      Array.isArray(object) === false &&
      Object.keys(object).length === 0;
  }

  exists_(value) {
    return (value !== null && value !== undefined);
  }
}
