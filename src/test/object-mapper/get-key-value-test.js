import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("raw methods");

import { getValue } from "../../lib/object-mapper/get-key-value";

group("The getValue() method", () => {

  lab.test("get value - simple", () => {
    const key = "foo";

    const obj = {
      "foo": "bar"
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep", () => {
    const key = "foo.bar";

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = "baz";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - simple array", () => {
    const key = "[]";

    const obj = ["bar"];

    const expected = ["bar"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - simple array defined index", () => {
    const key = "[1]";

    const obj = ["foo", "bar"];

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - two levels deep", () => {
    const key = "foo.baz.fog";

    const obj = {
      "foo": {
        "baz": {
          "fog": "bar"
        }
      }
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep and item is a array", () => {
    const key = "foo.baz[]";

    const obj = {
      "foo": {
        "baz": ["bar"]
      }
    };

    const expected = ["bar"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep and first item of array", () => {
    const key = "foo.baz[1]";

    const obj = {
      "foo": {
        "baz": ["bar", "foo"]
      }
    };

    const expected = "foo";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep and array and one level", () => {
    const key = "foo.baz[].fog";

    const obj = {
      "foo": {
        "baz": [{
          "fog": "bar"
        }]
      }
    };

    const expected = ["bar"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep and first item of array and one level", () => {
    const key = "foo.baz[0].fog";

    const obj = {
      "foo": {
        "baz": [{
          "fog": "bar"
        }]
      }
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level deep and first item of array and two levels", () => {
    const key = "foo.baz[0].fog.baz";

    const obj = {
      "foo": {
        "baz": [{
          "fog": {
            "baz": "bar"
          }
        }]
      }
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - one level array", () => {
    const key = "foo[]";

    const obj = {
      "foo": [{
        "baz": [{
          "fog": {
            "baz": "bar"
          }
        }]
      }]
    };

    const expected = [{
      "baz": [{
        "fog": {
          "baz": "bar"
        }
      }]
    }];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - two level deep array", () => {
    const key = "foo[].baz[].fog.baz";

    const obj = {
      "foo": [{
        "baz": [{
          "fog": {
            "baz": "bar"
          }
        }, {
          "fog": {
            "baz": "const"
          }
        }]
      }]
    };

    // Breaking change for V3 used to return ["bar", "const"]
    const expected = [["bar", "const"]];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("get value - crazy", () => {
    const key = "foo.baz[0].fog[1].baz";

    const obj = {
      "foo": {
        "baz": [{
          "fog": [, {
            "baz": "bar"
          }]
        }]
      }
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
  lab.test("getting an array item from a non-existent object", () => {
    const key = "fish[0].b";

    const obj = {
      "foo": {
        "baz": [{
          "fog": [, {
            "baz": "bar"
          }]
        }]
      }
    };

    let expected;

    const result = getValue(obj, key);

    expect(result).to.equal(expected);

  });
});
