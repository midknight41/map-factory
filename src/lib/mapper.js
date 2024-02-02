import Mapping from "./mapping";
import flattenDeep from "lodash/flattenDeep";
import flattenDepth from "lodash/flattenDepth";
import cloneDeep from "lodash/cloneDeep";

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

  set(key, value) {
    if (typeof key !== "string") {
      throw new Error("the key must be a string");
    }
    if (typeof value === "function") {
      return this.map(key).always.to(key, value);
    }
    return this.map(key).always.to(key, () => value);
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

    destination = this.handleChain_(destination);

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

  handleChain_(destination) {

    if (this.chainArray.length > 0) {
      this.chainArray.map(item => {
        destination = item.execute(destination);
      });
    }

    return destination;
  }

  getTransformDescriptor_(item) {

    /* eslint-disable prefer-const */
    const sourcePath = item.source;
    let targetPath = item.target;
    let {transform, alwaysSet, alwaysTransform,
      pipelineTransformations, flatten, flattenInverted, failureTransform} = item;

    let isCustomTransform = true;
    /* eslint-enable prefer-const */

    // TODO: offload to Mapping declaration
    const mode = this.decideMode_(item);
    const flattenings = this.decideArrayFlattening_(sourcePath, targetPath, flatten, flattenInverted);

    if (!transform) {
      isCustomTransform = false;
      transform = value => value;
    }

    if (!failureTransform && this.options.failureTransform) {
      failureTransform = this.options.failureTransform;
    }

    if (failureTransform && typeof failureTransform !== "function") {
      const valueToReturn = failureTransform;
      failureTransform = () => valueToReturn;
    }

    if (!targetPath) {
      targetPath = sourcePath;
    }

    return {mode, targetPath, sourcePath, transform, failureTransform, isCustomTransform, flattenings, options: {alwaysSet, alwaysTransform, pipelineTransformations, flatten, flattenInverted}};

  }

  decideArrayFlattening_(sourcePathOrArray, targetPath, flattenFlag, flattenInverted) {

    // some scenarios will supply an array not a string. Normalise it here.
    const sourcePaths = Array.isArray(sourcePathOrArray) ? sourcePathOrArray : [sourcePathOrArray];
    const flattenings = [];

    for (const sourcePath of sourcePaths) {

      // Check to see if the user has overriden default flattening behaviour
      const flattening = this.processSources_(sourcePath, targetPath, flattenInverted);
      flattening.flatten = flattenFlag !== null ? flattenFlag : flattening.flatten;

      flattenings.push(flattening);
    }

    return flattenings;

  }

  processSources_(sourcePath, targetPath, flattenInverted) {

    // no target means that the source is used as the target (same number of arrays)
    // so in this scenario we just suppress flattening
    // no source means copy the root object so we dont need this
    if (targetPath === null || targetPath === undefined || sourcePath === null || sourcePath === undefined) {
      return {sourceCount: 0, targetCount: 0, flatten: false, inverted: flattenInverted};
    }

    // const regArray = /\[\]|\[([\w\.'=]*)\]/g; use for support of jsonata-like query
    const regArray = /\[\]|\[([\w]*)\]/g;

    // Figure out source has move levels that target
    let sourceCount = sourcePath.match(regArray);
    let targetCount = targetPath.match(regArray);

    sourceCount = sourceCount === null ? sourceCount = 0 : sourceCount.length;
    targetCount = targetCount === null ? targetCount = 0 : targetCount.length;

    if (sourceCount > targetCount) {
      // we need to flatten this array to match the target structure
      return {sourceCount, targetCount, flatten: true, inverted: flattenInverted};

    }

    return {sourceCount, targetCount, flatten: false, inverted: flattenInverted};

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

  processSingleItem_(sourceObject, destinationObject, {targetPath, sourcePath, transform, failureTransform, flattenings, options}) {

    // Get source
    let value;

    if (!sourcePath) {
      value = cloneDeep(sourceObject);
    } else {
      value = this.om.getValue(sourceObject, sourcePath);
    }
    const flattening = flattenings[0];

    // default transformations
    if (this.exists_(value) && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        value = item(sourceObject, value);
      });
    }

    value = this.flattenValue_(flattening, value);

    // Apply transform if required
    if (this.exists_(value) || options.alwaysTransform === true) {
      value = transform(value);
    }

    if (!this.exists_(value) && failureTransform) {
      value = failureTransform(value);
    }

    // Set value on destination object
    if (!targetPath) {
      destinationObject = value;
      return destinationObject;
    }
    return this.setIfRequired_(destinationObject, targetPath, value, options);

  }

  processMultiItem_(sourceObject, destinationObject, {sourcePath, targetPath, transform, failureTransform, isCustomTransform, flattenings, options}) {

    if (isCustomTransform === false) {
      throw new Error("Multiple selections must map to a transform. No transform provided.");
    }

    let values = [];

    // Get source
    for (const fromKey of sourcePath) {
      const value = this.om.getValue(sourceObject, fromKey);
      values.push(value);
    }

    let value;

    // default transformations
    if (anyValues && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        values = item(sourceObject, values);
      });
    }

    // flatten values if required
    for (let i = 0; i < values.length; i++) {
      values[i] = this.flattenValue_(flattenings[i], values[i]);
    }

    // Apply transform if appropriate
    if (anyValues || options.alwaysTransform === true) {
      value = transform(...values);
    }

    if (!anyValues && failureTransform) {
      value = failureTransform(value);
    }

    // Set value on destination object
    return this.setIfRequired_(destinationObject, targetPath, value, options);

  }

  processOrItem_(sourceObject, destinationObject, {sourcePath, targetPath, transform, failureTransform, flattenings, options}) {

    let orValue;
    const sourceArray = sourcePath;
    let i = 0;

    for (const sourceKey of sourceArray) {

      orValue = this.om.getValue(sourceObject, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }

      i++;
    }

    const flattening = flattenings[i];

    // default transformations
    if (this.exists_(orValue) && options.pipelineTransformations.length > 0) {
      options.pipelineTransformations.map(item => {
        orValue = item(sourceObject, orValue);
      });
    }

    orValue = this.flattenValue_(flattening, orValue);

    // has a transform
    if (this.exists_(orValue) || options.alwaysTransform === true) {
      orValue = transform(orValue);
    }

    if (!this.exists_(orValue) && failureTransform) {
      orValue = failureTransform(orValue);
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

  flattenValue_(flattening, value) {

    if (flattening !== undefined && flattening.flatten === true) {
      const seekDepth = flattening.targetCount - 1;

      if (flattening.inverted === true) {
        return flattenDepth(value, flattening.sourceCount - flattening.targetCount);
      }

      return this.flattenArray_(value, seekDepth);

    }

    return value;
  }

  flattenArray_(valueArray, seekDepth, currentDepth = 0) {

    if (Array.isArray(valueArray) === false) return valueArray;
    if (valueArray.length === 0) return valueArray;

    if (seekDepth === currentDepth) {
      valueArray = flattenDeep(valueArray);
      // console.log("valueArray final:", valueArray);
      return valueArray;
    }

    // value is always an array
    for (let i = 0; i < valueArray.length; i++) {
      const newDepth = currentDepth + 1;
      valueArray[i] = this.flattenArray_(valueArray[i], seekDepth, newDepth);
    }

    // console.log("valueArray:", valueArray);
    return valueArray;
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
