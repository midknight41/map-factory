import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory", "object-mapper");

import getValue from "../../lib/object-mapper/get-key-value";

group("The getValue() method", () => {

  lab.test("get value - simple", done => {
    const key = "foo";

    const obj = {
      "foo": "bar"
    };

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - one level deep", done => {
    const key = "foo.bar";

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = "baz";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - simple array", done => {
    const key = "[]";

    const obj = ["bar"];

    const expected = ["bar"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - simple array defined index", done => {
    const key = "[1]";

    const obj = ["foo", "bar"];

    const expected = "bar";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - two levels deep", done => {
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
    return done();
  });
  lab.test("get value - one level deep and item is a array", done => {
    const key = "foo.baz[]";

    const obj = {
      "foo": {
        "baz": ["bar"]
      }
    };

    const expected = ["bar"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - one level deep and first item of array", done => {
    const key = "foo.baz[1]";

    const obj = {
      "foo": {
        "baz": ["bar", "foo"]
      }
    };

    const expected = "foo";

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - one level deep and array and one level", done => {
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
    return done();
  });
  lab.test("get value - one level deep and first item of array and one level", done => {
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
    return done();
  });
  lab.test("get value - one level deep and first item of array and two levels", done => {
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
    return done();
  });
  lab.test("get value - one level array", done => {
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
    return done();
  });
  lab.test("get value - two level deep array", done => {
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

    const expected = ["bar", "const"];

    const result = getValue(obj, key);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("get value - crazy", done => {
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
    return done();
  });

});
