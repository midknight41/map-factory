import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("raw methods");

import setValue from "../../lib/object-mapper/set-key-value";

group("The setValue() method", () => {

  lab.test("sets correct value and creates base object", () => {
    const key = "foo";
    const value = "bar";

    const expected = {
      foo: "bar"
    };

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("sets correct value when base object is provided", () => {
    const key = "foo";
    const value = "bar";

    const base = {
      baz: "foo"
    };

    const expected = {
      baz: "foo",
      foo: "bar"
    };

    const result = setValue(base, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("works correctly when the root key is an array", () => {
    const key = "[]";
    const value = "bar";

    const expected = ["bar"];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("simple array with base array", () => {
    const key = "[]";
    const value = "bar";

    const base = ["foo"];
    const expected = ["bar"];

    const result = setValue(base, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("simple array in index 0", () => {
    const key = "[0]";
    const value = "bar";

    const expected = ["bar"];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("simple array in index 0 with base array", () => {
    const key = "[0]";
    const value = "bar";

    const base = ["foo"];
    const expected = ["bar"];

    const result = setValue(base, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("simple array in index 1", () => {
    const key = "[1]";
    const value = "bar";

    const expected = [, "bar"];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });

  lab.test("one level deep", () => {
    const key = "foo.bar";
    const value = "baz";

    const expected = {
      foo: {
        bar: "baz"
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("object inside simple array", () => {
    const key = "[].foo";
    const value = "bar";

    const expected = [{
      foo: "bar"
    }];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array to object inside simple array", () => {
    const key = "[].foo";
    const value = ["bar", "baz"];

    const expected = [
      {
        foo: "bar"
      },
      {
        foo: "baz"
      }
    ];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("object inside simple array defined index", () => {
    const key = "[3].foo";
    const value = "bar";

    const expected = [, , , {
      foo: "bar"
    }];

    const result = setValue(null, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("two levels deep", () => {
    const key = "foo.bar.baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: {
          baz: "foo"
        }
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("one level deep inside array", () => {
    const key = "foo.bar[]";
    const value = "baz";

    const expected = {
      foo: {
        bar: ["baz"]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("one level deep inside array with one level deep", () => {
    const key = "foo.bar[].baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: [{
          baz: "foo"
        }]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("one level deep inside array with one level deep inside a existing array", () => {
    const key = "foo.bar[].baz";
    const value = "foo";

    const base = {
      foo: {
        bar: [{
          bar: "baz"
        }]
      }
    };

    const expected = {
      foo: {
        bar: [{
          bar: "baz", baz: "foo"
        }]
      }
    };

    const result = setValue(base, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("one level deep inside array at defined index with one level deep", () => {
    const key = "foo.bar[1].baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: [, {
          baz: "foo"
        }]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array to simple object", () => {
    const key = "foo[].baz";
    const value = ["foo", "const"];

    const expected = {
      foo: [
        {
          baz: "foo"
        },
        {
          baz: "const"
        }
      ]
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array to two level object", () => {
    const key = "bar.foo[].baz";
    const value = ["foo", "const"];

    const expected = {
      bar: {
        foo: [
          {
            baz: "foo"
          },
          {
            baz: "const"
          }
        ]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array to two level object", () => {
    const key = "bar.foo[].baz.foo";
    const value = ["foo", "const"];

    const expected = {
      bar: {
        foo: [
          {
            baz: {
              foo: "foo"
            }
          },
          {
            baz: {
              foo: "const"
            }
          }
        ]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array to object", () => {

    const key = "one[].two[].three";
    const value = ["A", "B"];

    const expected = {
      one: [{
        two: [{
          three: "A"
        }, {
          three: "B"
        }]
      }]
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("array of arrays to object", () => {

    const key = "one[].two[].three";
    const value = [["A"], ["B"]];

    const expected = {
      one: [{
        two: [{
          three: "A"
        }]
      },
      {
        two: [{
          three: "B"
        }]
      }]
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });
  lab.test("crazy", () => {
    const key = "foo.bar[1].baz[2].thing";
    const value = "foo";

    const expected = {
      foo: {
        bar: [, {
          baz: [, , {
            thing: "foo"
          }]
        }]
      }
    };

    const result = setValue({}, key, value);

    expect(result).to.equal(expected);

  });

});
