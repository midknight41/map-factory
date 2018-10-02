/* eslint-disable */

/**
 * Make the set of a value withing the key in the passed object
 * @param baseObject
 * @param destinationKey
 * @param fromValue
 * @returns {*|{}}
 */
function setValue(baseObject, destinationKey, fromValue) {
  const regDot = /\./g;

  const keys = destinationKey.split(regDot);
  const key = keys.splice(0, 1);

  return _setValue(baseObject, key[0], keys, fromValue, -1);
}
module.exports = setValue;

/**
 * Set the value within the passed object, considering if is a array or object set
 * @param destinationObject
 * @param key
 * @param keys
 * @param fromValue
 * @returns {*}
 * @private
 * @recursive
 */
function _setValue(destinationObject, startKey, keys, fromValue, depth, parentIsArray = false) {
  var regArray = /(\[\]|\[(.*)\])$/g
    , regAppendArray = /(\[\]|\[(.*)\]\+)$/g
    , regCanBeNull = /(\?)$/g
    , match
    , appendToArray
    , canBeNull
    , arrayIndex = 0
    , valueIndex
    , isPropertyArray = false
    , isValueArray = false
    , value
    ;
  let key = startKey;

  depth++;

  const indent = new Array((depth + 1) * 2).join(" ");

  // console.log(indent, "");
  // console.log(indent, "**************** SET VALUE ********************");
  // console.log(indent, "destinationObject: ", destinationObject);
  // console.log(indent, "fromValue: ", fromValue);

  // STEP 1
  // Identify which features are used in the query syntax

  // can be null feature
  canBeNull = regCanBeNull.test(key);
  if (canBeNull) {
    key = key.replace(regCanBeNull, "");
  }

  // normal array feature
  match = regArray.exec(key);
  if (match) {
    // console.log(indent, "feature type: normal array");
    isPropertyArray = true;
    key = key.replace(regArray, "");
    isValueArray = (key !== "");
  }

  // append to array feature
  appendToArray = regAppendArray.exec(key);
  if (appendToArray) {
    // console.log(indent, "feature type: append array");
    match = appendToArray;
    isPropertyArray = true;
    isValueArray = (key !== "");
    key = key.replace(regAppendArray, "");
  }

  if (startKey === key) {
    // console.log(indent, "feature type: regular property");
  }

  const destinationStartedEmpty = _isEmpty(destinationObject);

  // console.log(indent, "destinationStartedEmpty: ", destinationStartedEmpty);
  // console.log(indent, "key:", key);
  // console.log(indent, "next key:", keys[0]);
  // console.log(indent, "remaining key:", JSON.stringify(keys));
  // console.log(indent, "original key:", startKey);
  // console.log(indent, "*********************************************");

  // STEP 2
  // This block decides on the shape of this segment of the return object
  if (destinationStartedEmpty) {

    // console.log(indent, "Destination is empty");
    if (isPropertyArray) {

      arrayIndex = match[2] || 0;

      if (isValueArray) {
        destinationObject = {};
        destinationObject[key] = [];
      } else {
        destinationObject = [];
      }

    } else {
      destinationObject = {};
    }

  } else {

    // console.log(indent, "Destination has a value", key, value, isValueArray);
    if (isPropertyArray) {
      arrayIndex = match[2] || 0;
    }
  }

  // This block means we have reached the end of parsing the target keys
  if (keys.length === 0) {
    // console.log(indent, "last segment, resolve value");

    if (!canBeNull && (fromValue === null || fromValue === undefined)) {

      // console.log(indent, "resolve", key, fromValue, destinationObject, parentIsArray);
      if (parentIsArray === true && destinationStartedEmpty) return null;
      
      if (isValueArray) {
        destinationObject[key] = [];
      }

      return destinationObject;
    }

    if (isValueArray) {

      if (Array.isArray(destinationObject[key]) === false) {
        // console.log(indent, "first one");

        if (Array.isArray(fromValue)) {
          destinationObject[key] = fromValue;
          return destinationObject;
        }

        destinationObject[key] = [];

      }

      if (appendToArray) {
        destinationObject[key].push(fromValue);
        return destinationObject;

      }

       // Check if we are trying to set an array value
      // to a target array. Avoid nesting that array in another array. 
      if (Array.isArray(fromValue)) {
        destinationObject[key] = fromValue;
        return destinationObject;
      }

      destinationObject[key][arrayIndex] = fromValue;
      return destinationObject;

    }

    if (Array.isArray(destinationObject)) {
      // console.log(indent, "Array.isArray if", fromValue, `key: "${startKey}"`);

      // Check if we are trying to set an array value
      // to a target array. Avoid nesting that array in another array. 
      if (Array.isArray(fromValue)) {
        destinationObject = fromValue;
        return destinationObject;
      }

      destinationObject[arrayIndex] = fromValue;
      return destinationObject;

    }

    // console.log(indent, "Array.isArray else", fromValue, `key: "${startKey}"`);
    destinationObject[key] = fromValue;
    return destinationObject;

  }

  if (isValueArray) {

    // Here we process arrays

    // Set target field as a new array if it doesn't exist yet
    if (Array.isArray(destinationObject[key]) === false) {
      destinationObject[key] = [];
    }

    // Here we are processing a normal array
    if (Array.isArray(fromValue) && _isNextArrayProperty(keys) === false) {

      // iterate through the source values and call 
      for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {

        // console.log(indent, `processing a normal array - arrayIndex:${arrayIndex}`);

        const itemKey = keys[0];
        const sliced = keys.slice(1);

        // console.log(indent, "sub item", `keys: ${keys}`, `sliced: ${sliced}`, fromValue[valueIndex]);

        value = fromValue[valueIndex];
        destinationObject[key][arrayIndex + valueIndex] = _setValue(destinationObject[key][arrayIndex + valueIndex], itemKey, sliced, value, depth);
      }

      return destinationObject;

    }

    if (Array.isArray(fromValue) && fromValue.length > 0) {

      // console.log(indent, `process an array of arrays - arrayIndex:${arrayIndex}`);

      const itemKey = keys[0];
      const sliced = keys.slice(1);

      // We only want to look through arrays of arrays
      // peak at the first item to make that distinction
      if (Array.isArray(fromValue[0]) === false) {
        destinationObject[key][arrayIndex] = _setValue(destinationObject[key][arrayIndex], keys[0], keys.slice(1), fromValue, depth);
        return destinationObject;
      }

      for (let i = 0; i < fromValue.length; i++) {
        let parentItem = destinationObject[key][i];

        if (parentItem === undefined) parentItem = {};

        // console.log(indent, "sub item", `keys: ${keys}`, `sliced: ${sliced}`, parentItem, fromValue[i]);
        destinationObject[key][i] = _setValue(parentItem, itemKey, sliced, fromValue[i], depth, true);
      }

      return destinationObject;
    }

    destinationObject[key][arrayIndex] = _setValue(destinationObject[key][arrayIndex], keys[0], keys.slice(1), fromValue, depth);

    return destinationObject;

  }

  if (Array.isArray(destinationObject)) {

    // Arrays are processed here
    // console.log(indent, "Processing array", destinationObject, fromValue);

    // Source arrays need all there sub items extracted
    if (Array.isArray(fromValue)) {
      for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {
        value = fromValue[valueIndex];
        destinationObject[arrayIndex + valueIndex] = _setValue(destinationObject[arrayIndex + valueIndex], keys[0], keys.slice(1), value, depth, true);
      }

      return destinationObject;

    }

    // It's a single value we want to process
    // console.log(indent, "final _setValue call", keys[0], fromValue);
    const retval = _setValue(destinationObject[arrayIndex], keys[0], keys.slice(1), fromValue, depth, true);

    if (retval !== null) {
      destinationObject[arrayIndex] = retval;
    }

    return destinationObject;

  }

  destinationObject[key] = _setValue(destinationObject[key], keys[0], keys.slice(1), fromValue, depth);
  return destinationObject;

}

/**
 * Check if next key is a array lookup
 * @param keys
 * @returns {boolean}
 * @private
 */
function _isNextArrayProperty(keys) {
  var regArray = /(\[\]|\[(.*)\])$/g
    ;
  return regArray.test(keys[0]);
}

/**
 * Check if passed object is null, undefined, empty, or zero.length array
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmpty(object) {

  if (typeof object === 'undefined' || object === null) {
    return true;
  }

  if (_isEmptyObject(object)) {
    return true;
  }

  if (_isEmptyArray(object)) {
    return true;
  }

  return false;
}

/**
 * Check if passed object is empty
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmptyObject(object) {
  return typeof object === 'object'
    && Array.isArray(object) === false
    && Object.keys(object).length === 0
    ;
}

/**
 * Check if passed array is empty or with empty values only
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmptyArray(object) {
  return Array.isArray(object)
    && (object.length === 0
      || object.join("").length === 0)
    ;
}
