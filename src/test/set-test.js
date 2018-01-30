import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();

const createMapper = require("../lib/index");

lab.describe("The set() method", () => {
    lab.test("Set a field in the destination", done => {

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

      return done();
    });

    lab.test("Set a field in the destination when combined with the map()", done => {

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

      return done();
    });

    lab.test("Should throw error when set field is called with a key of type other than string", done => {

      const mapper = createMapper();

      expect(() => mapper.set(null, "bar")).to.throw("the key must be a string");

      return done();
    });
  });

