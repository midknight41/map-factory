/* eslint-disable */

/**
 * Make the set of a value withing the key in the passed object
 * @param baseObject
 * @param destinationKey
 * @param fromValue
 * @returns {*|{}}
 */
function SetKeyValue(baseObject, destinationKey, fromValue) {
  const regDot = /\./g;

  const keys = destinationKey.split(regDot);
  const key = keys.splice(0, 1);

  return _setValue(baseObject, key[0], keys, fromValue);
}
module.exports = SetKeyValue;

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
function _setValue(destinationObject, startKey, keys, fromValue, parentIsArray = false) {
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

  // console.log("top", destinationObject);

  // can be null feature
  canBeNull = regCanBeNull.test(key);
  if (canBeNull) {
    key = key.replace(regCanBeNull, '');
  }

  // normal array feature
  match = regArray.exec(key);
  if (match) {
    // console.log("normal array feature");
    isPropertyArray = true;
    key = key.replace(regArray, '');
    isValueArray = (key !== '');
  }

  // append to array feature
  appendToArray = regAppendArray.exec(key);
  if (appendToArray) {
    match = appendToArray;
    isPropertyArray = true;
    isValueArray = (key !== '');
    key = key.replace(regAppendArray, '');
  }

  if (startKey === key) {
    // console.log("regular property feature");
  }

  // console.log("key changes", startKey !== key);

  const destinationStartedEmpty = _isEmpty(destinationObject);

  if (destinationStartedEmpty) {
    // console.log("destination is empty");
    if (isPropertyArray) {

      arrayIndex = match[2] || 0;
      if (isValueArray) {
        // console.log("type: property array and a value array. get:", fromValue, `key: "${startKey}"`);
        destinationObject = {};
        destinationObject[key] = [];
      } else {
        // console.log("type: property array but not value array. get:", fromValue, `key: "${startKey}"`);
        destinationObject = [];
      }
    } else {
      // console.log("type: empty object and not an array. get:", fromValue, `key: "${startKey}"`);
      destinationObject = {};
    }

  } else {
    // console.log("destination has a value");

    if (isPropertyArray) {
      // console.log("type: property array. get:", fromValue, `key: "${startKey}"`);
      arrayIndex = match[2] || 0;
    }
  }

  if (keys.length === 0) {
    // console.log("final pass", `key: "${startKey}"`);

    if (!canBeNull && (fromValue === null || fromValue === undefined)) {

      // console.log("resolve", fromValue, destinationObject, parentIsArray);
      if (parentIsArray === true && destinationStartedEmpty) return null;

      return destinationObject;
    }
    if (isValueArray) {
      if (Array.isArray(destinationObject[key]) === false) {
        // console.log("first one");
        destinationObject[key] = [];
      }
      if (appendToArray) {
        destinationObject[key].push(fromValue);
      } else {
        destinationObject[key][arrayIndex] = fromValue;
      }
    } else if (Array.isArray(destinationObject)) {
      // console.log("Array.isArray if", fromValue, `key: "${startKey}"`);
      destinationObject[arrayIndex] = fromValue;
    } else {
      // console.log("Array.isArray if", fromValue, `key: "${startKey}"`);
      destinationObject[key] = fromValue;
    }
  } else {
    if (isValueArray) {

      // console.log("isValueArray", fromValue);

      if (Array.isArray(destinationObject[key]) === false) {
        // console.log("second one");
        destinationObject[key] = [];
      }
      if (Array.isArray(fromValue) && _isNextArrayProperty(keys) === false) {
        for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {
          value = fromValue[valueIndex];
          destinationObject[key][arrayIndex + valueIndex] = _setValue(destinationObject[key][arrayIndex + valueIndex], keys[0], keys.slice(1), value);
        }
      } else {
        destinationObject[key][arrayIndex] = _setValue(destinationObject[key][arrayIndex], keys[0], keys.slice(1), fromValue);
      }
    } else if (Array.isArray(destinationObject)) {
      // Arrays are processed here
      // console.log("Processing array", destinationObject, fromValue);

      // Source arrays need all there sub items extracted
      if (Array.isArray(fromValue)) {
        for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {
          value = fromValue[valueIndex];
          destinationObject[arrayIndex + valueIndex] = _setValue(destinationObject[arrayIndex + valueIndex], keys[0], keys.slice(1), value, true);
        }
      } else {
        // It's a single value we want to process
        // console.log("final _setValue call", keys[0], fromValue);
        const retval = _setValue(destinationObject[arrayIndex], keys[0], keys.slice(1), fromValue, true);

        // console.log("retval", retval)
        if (retval !== null) destinationObject[arrayIndex] = retval;
      }
    } else {
      destinationObject[key] = _setValue(destinationObject[key], keys[0], keys.slice(1), fromValue);
    }
  }


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
      || object.join('').length === 0)
    ;
}
