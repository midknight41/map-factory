/* eslint-disable */
const flattenDeep = require("lodash.flattendeep");

'use strict';

/**
 * Make the get of a value with the key in the passed object
 * @param fromObject
 * @param fromKey
 * @constructor
 * @returns {*}
 */
function getValue(fromObject, fromKey) {
  var regDot = /\./g
    , regFinishArray = /.+(\[\])/g
    , keys
    , key
    , result
    , lastValue
    ;

  keys = fromKey.split(regDot);
  key = keys.splice(0, 1);

  result = _getValue(fromObject, key[0], keys);

  return handleArrayOfUndefined_(result);
}

module.exports.getValue = getValue;

function handleArrayOfUndefined_(value) {

  if (Array.isArray(value) === false) {
    return value;
  }

  // Arrays of empty array aren't interesting. flatten them and see if we've got any data
  // There are probably more performant ways of doing this with getValue()
  if (Array.isArray(value) === true) {

    const emptyTest = flattenDeep(value);

    if (emptyTest.length === 0) {
      return undefined;
    }

    return scanArrayForValue_(emptyTest, value);
  }

  return scanArrayForValue_(value, value);
}

function scanArrayForValue_(arrayToScan, defaultValue) {

  for (const item of arrayToScan) {
    if (item !== undefined && item !== null) {
      return defaultValue;
    }
  }

  return undefined;

}

/**
 * Get the value of key within passed object, considering if there is a array or object
 * @param fromObject
 * @param key
 * @param keys
 * @returns {*}
 * @private
 * @recursive
 */
function _getValue(fromObject, key, keys) {
  var regArray = /(\[\]|\[(.*)\])$/g
    , match
    , arrayIndex
    , isValueArray = false
    , result
    ;

  if (!fromObject) {
    return;
  }

  match = regArray.exec(key);
  if (match) {
    key = key.replace(regArray, '');
    isValueArray = (key !== '');
    arrayIndex = match[2];
  }

  if (keys.length === 0) {
    if (isValueArray) {
      if (typeof arrayIndex === 'undefined' || fromObject[key] === undefined) {
        result = fromObject[key];
      } else {
        result = fromObject[key][arrayIndex];
      }
    } else if (Array.isArray(fromObject)) {
      if (key === '') {
        if (typeof arrayIndex === 'undefined') {
          result = fromObject;
        } else {
          result = fromObject[arrayIndex];
        }
      } else {
        result = fromObject.map(function (item) {
          return item[key];
        })
      }
    } else {
      result = fromObject[key];
    }
  } else {
    if (isValueArray) {
      if (Array.isArray(fromObject[key])) {
        if (typeof arrayIndex === 'undefined') {
          result = fromObject[key].map(function (item) {
            return _getValue(item, keys[0], keys.slice(1));
          });
        } else {
          result = _getValue(fromObject[key][arrayIndex], keys[0], keys.slice(1));
        }
      } else {
        if (typeof arrayIndex === 'undefined') {
          result = _getValue(fromObject[key], keys[0], keys.slice(1));
        } else {
          result = _getValue(fromObject[key][arrayIndex], keys[0], keys.slice(1));
        }
      }
    } else if (Array.isArray(fromObject)) {
      if (key === '') {
        if (typeof arrayIndex === 'undefined') {
          result = _getValue(fromObject, keys[0], keys.slice(1));
        } else {
          result = _getValue(fromObject[arrayIndex], keys[0], keys.slice(1));
        }
      } else {
        result = fromObject.map(function (item) {
          result = _getValue(item, keys[0], keys.slice(1));
        })
      }
      if (typeof arrayIndex === 'undefined') {
        result = fromObject.map(function (item) {
          return _getValue(item, keys[0], keys.slice(1));
        });
      } else {

        result = _getValue(fromObject[arrayIndex], keys[0], keys.slice(1));
      }
    } else {
      result = _getValue(fromObject[key], keys[0], keys.slice(1));
    }
  }

  return result;
}
