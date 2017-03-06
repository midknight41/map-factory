import Mapping from "./mapping";
// import getKeyValue from "./object-mapper/get-key-value";
// import setKeyValue from "./object-mapper/set-key-value";

export default class Mapper {

  constructor(experiment, om) {

    this.om = om;
    this.assignment = [];
    this.mapCache_ = null;
    this.experiment = experiment;

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

    if (sourceArray === null || sourceArray === undefined) {
      throw new Error("A sourceArray object is required");
    }

    if (Array.isArray(sourceArray) !== true) {
      throw new Error("The sourceArray parameter must be an array");
    }

    return sourceArray.map(item => {
      return this.execute(item, null);
    });

  }

  // execute(source, destination) {
  //   if (!this.experiment) {
  //     return this.executeOld(source, destination);
  //   }

  //   return this.executeNew(source, destination);
  // }

  // executeNew(source, destination) {

  //   if (source === null || source === undefined) {
  //     throw new Error("A source object is required");
  //   }

  //   if (destination === null || destination === undefined) {
  //     destination = {};
  //   }

  //   if (this.mapCache_ === null) {
  //     this.mapCache_ = this.createMapData_();
  //   }

  //   const output = this.om(source, destination, this.mapCache_.transform);

  //   return this.appendMultiSelections_(source, output, this.mapCache_.multiMaps);
  // }

  execute(source, destination) {

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
