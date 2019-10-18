import { expect } from "@hapi/code";
import * as Lab from "@hapi/lab";

const lab = exports.lab = Lab.script();

const createMapper = require("../lib/index");

lab.describe("The set() method", () => {
  lab.test("Set a field in the destination", () => {

    const expected = {
      "foo": "bar",
      "fooFunc": "bar"
    };

    const source = {};

    const mapper = createMapper();

    mapper.set("foo", "bar")
      .set("fooFunc", () => "bar");

    const result = mapper.execute(source);

    expect(result).to.equal(expected);

  });

  lab.test("Set a field in the destination when combined with the map()", () => {

    const expected = {
      "foo": "bar",
      "fooFunc": "bar",
      "source": true
    };

    const source = {source: true};

    const mapper = createMapper();

    mapper.map().set("foo", "bar")
      .set("fooFunc", () => "bar");

    const result = mapper.execute(source);

    expect(result).to.equal(expected);

  });

  lab.test("Should throw error when set field is called with a key of type other than string", () => {

    const mapper = createMapper();

    expect(() => mapper.set(null, "bar")).to.throw("the key must be a string");

  });
});

