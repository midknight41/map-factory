import Mapping from "./mapping";
// import getKeyValue from "./object-mapper/get-key-value";
// import setKeyValue from "./object-mapper/set-key-value";

const SINGLE_MODE = 0;
const MULTI_MODE = 1;
const OR_MODE = 2;

export default class Mapper {

  constructor(opts, om) {

    this.om = om;
    this.experimental = opts.experimental;
    this.options = opts;

    this.assignment = [];
    this.mapCache_ = null;

  }

  registerMapping(mapping) {

    this.assignment.push(mapping);
  }

  map(source) {

    const mapping = new Mapping(source, this, this.options);
    this.registerMapping(mapping);

    return mapping;

  }

  each(sourceArray) {

    if (!sourceArray) {
      // This should probably return undefined
      return null;
    }

    if (Array.isArray(sourceArray) !== true) {
      throw new Error("The sourceArray parameter must be an array");
    }

    if (sourceArray.length > 0) {
      return sourceArray.map(item => {
        return this.execute(item, null);
      });
    }

    // This should probably return undefined
    return null;
  }

  execute(source, destination) {

    if (source === null || source === undefined) {
      throw new Error("A source object is required");
    }

    if (destination === null || destination === undefined) {
      destination = {};
    }

    for (const item of this.assignment) {

      // TODO: This method should be done at map declaration not at execution
      const descriptor = this.getTransformDescriptor_(item);

      // annoyingly, VS Code's auto format is at odds with eslint

      /* eslint-disable indent */
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

    return destination;
  }

  getTransformDescriptor_(item) {

    const sourcePath = item.source;
    let targetPath = item.target;
    let { transform } = item;
    let isCustomTransform = true;

    const mode = this.decideMode_(item);

    // TODO: offload to Mapping declaration
    if (!transform) {
      isCustomTransform = false;
      transform = value => value;
    }

    if (!targetPath) {
      targetPath = sourcePath;
    }

    return { mode, targetPath, sourcePath, transform, isCustomTransform };

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

  processSingleItem_(sourceObject, destinationObject, { targetPath, sourcePath, transform }) {

    // Get source
    let value = this.om.getKeyValue(sourceObject, sourcePath);

    // Apply transform - will become optional
    if (this.exists_(value) || this.options.alwaysTransform === true) {
      value = transform(value);
    }

    // Set value on destination object
    if (this.exists_(value) || this.options.alwaysSet === true) {
      return this.om.setKeyValue(destinationObject, targetPath, value);
    }

    return destinationObject;

  }

  processMultiItem_(sourceObject, destinationObject, { sourcePath, targetPath, transform, isCustomTransform }) {

    // console.log("multi mode", targetPath, sourcePath, transform, isCustomTransform);

    if (isCustomTransform === false) {
      throw new Error("Multiple selections must map to a transform. No transform provided.");
    }

    const values = [];
    let anyValues = false;

    // Get source
    for (const fromKey of sourcePath) {

      const value = this.om.getKeyValue(sourceObject, fromKey);

      if (this.exists_(value)) {
        anyValues = true;
      }

      values.push(value);
    }

    // console.log("pre-transform value", values);
    let value;

    // Apply transform - will become optional
    if (anyValues || this.options.alwaysTransform === true) {
      value = transform(...values);
    }
    // console.log("post-transform value", value);

    // Set value on destination object
    if (this.exists_(value) || this.options.alwaysSet === true) {
      return this.om.setKeyValue(destinationObject, targetPath, value);
    }

    return destinationObject;

  }

  processOrItem_(sourceObject, destinationObject, { sourcePath, targetPath, transform, isCustomTransform }) {

    // console.log("or mode", targetPath, sourcePath, transform, isCustomTransform);

    let orValue;
    const sourceArray = sourcePath;

    for (const sourceKey of sourceArray) {

      orValue = this.om.getKeyValue(sourceObject, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }
    }

    // console.log("pre-transform value", orValue);

    // no transform
    if (isCustomTransform === false) {

      return this.om.setKeyValue(destinationObject, targetPath, orValue);
    }

    // has a transform
    const params = [];
    params.push(orValue);

    const result = transform(...params);

    // console.log("post-transform value", result);

    return this.om.setKeyValue(destinationObject, targetPath, result);
  }

  exists_(value) {
    return (value !== null && value !== undefined);
  }
}
