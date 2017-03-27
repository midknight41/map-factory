import Mapping from "./mapping";
// import getKeyValue from "./object-mapper/get-key-value";
// import setKeyValue from "./object-mapper/set-key-value";

const SINGLE_MODE = 0;
const MULTI_MODE = 1;
const OR_MODE = 2;

export default class Mapper {

  constructor(experimental, om) {

    this.om = om;
    this.experimental = experimental;

    this.assignment = [];
    this.mapCache_ = null;

  }

  registerMapping(mapping) {

    this.assignment.push(mapping);
  }

  map(source) {

    const mapping = new Mapping(source, this);
    this.registerMapping(mapping);

    return mapping;

  }

  each(sourceArray) {

    if (!sourceArray) {
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

    return null;
  }

  execute(source, destination) {
    if (!this.experimental) {
      return this.executeOld(source, destination);
    }

    return this.executeNew(source, destination);
  }

  executeNew(source, destination) {

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
      // console.log("descriptor", descriptor)

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

    // console.log("single mode", targetPath, sourcePath, transform);
    // Get source
    let value = this.om.getKeyValue(sourceObject, sourcePath);

    // console.log("pre-transform value", value);
    // Apply transform - will become optional
    value = transform(value);

    // console.log("post-transform value", value);
    // Set value on destination object
    return this.om.setKeyValue(destinationObject, targetPath, value);

  }

  processMultiItem_(sourceObject, destinationObject, { sourcePath, targetPath, transform, isCustomTransform }) {

    // console.log("multi mode", targetPath, sourcePath, transform, isCustomTransform);

    if (isCustomTransform === false) {
      throw new Error("Multiple selections must map to a transform. No transform provided.");
    }

    const values = [];

    // Get source
    for (const fromKey of sourcePath) {
      values.push(this.om.getKeyValue(sourceObject, fromKey));
    }

    // console.log("pre-transform value", values);

    // Apply transform - will become optional
    const value = transform(...values);

    // console.log("post-transform value", value);

    // Set value on destination object
    return this.om.setKeyValue(destinationObject, targetPath, value);

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

  // Old execute logic is below: marked for death

  executeOld(source, destination) {

    if (source === null || source === undefined) {
      throw new Error("A source object is required");
    }

    if (destination === null || destination === undefined) {
      destination = {};
    }

    if (this.mapCache_ === null) {
      this.mapCache_ = this.createMapData_();
    }

    const output = this.om(source, destination, this.mapCache_.transform);

    return this.appendMultiSelections_(source, output, this.mapCache_.multiMaps);
  }

  createMapData_() {

    const mapData = {
      transform: {},
      multiMaps: []
    };

    for (const item of this.assignment) {

      const sourceKey = item.source;
      let mapDetail = item.target;

      if (Array.isArray(item.source)) {

        // transforms are optional in orMode
        if (!item.transform && item.orMode === false) {
          throw new Error("Multiple selections must map to a transform. No transform provided.");
        }

        mapData.multiMaps.push(item);
        continue;
      }

      if (!mapDetail) {
        mapDetail = sourceKey;
      }

      if (item.transform) {
        mapDetail = {
          key: mapDetail,
          transform: item.transform
        };
      }

      if (mapData.transform[sourceKey] === undefined) {
        mapData.transform[sourceKey] = [];
      }

      mapData.transform[sourceKey].push(mapDetail);
    }

    return mapData;
  }

  appendMultiSelections_(source, target, multiMaps) {

    let output = target;

    for (const item of multiMaps) {

      const params = [];

      // this multi-select is be processed in orMode
      if (item.orMode) {

        output = this.applyOrMode_(item, source, output);
        continue;
      }

      const sourceArray = item.source;

      // normal mode
      for (const sourceKey of sourceArray) {

        const value = this.om.getKeyValue(source, sourceKey);
        params.push(value);
      }

      const result = item.transform.apply(null, params);

      output = this.om.setKeyValue(output, item.target, result);
    }

    return output;
  }

  applyOrMode_(item, source, output) {

    let orValue = null;
    const sourceArray = item.source;

    for (const sourceKey of sourceArray) {

      orValue = this.om.getKeyValue(source, sourceKey);

      if (orValue !== null && orValue !== undefined) {
        break;
      }
    }

    // no transform
    if (item.transform === undefined) {

      output = this.om.setKeyValue(output, item.target, orValue);
      return output;
    }

    // has a transform
    const params = [];
    params.push(orValue);

    const result = item.transform.apply(null, params);
    output = this.om.setKeyValue(output, item.target, result);
    return output;
  }

}
