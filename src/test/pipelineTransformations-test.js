import * as Lab from "lab";
import { expect } from "code";
import createMapper from "../lib";

const { describe, it, before, beforeEach } = exports.lab = Lab.script();

let source;
let expected;
let mapper;
let actual;

describe("Pipeline transformations functionality of the mapper", () => {

  describe("accceptIf", () => {

    before(done => {
      mapper = createMapper();

      mapper
        .map("foo").acceptIf("voila", "a").to("bar")
        .map("foo").acceptIf("check", check => check > 5).to("bar1");

      source = {
        "foo": {
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        },
        "voila": "a",
        "check": 2
      };

      expected = {
        "bar": {
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        }
      };
      done();
    });

    describe("when its used", () => {

      it("should return the desired result", done => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);
        done();
      });
    });

    describe("parameter validation", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error if key is null", done => {
        expect(() => mapper("foo").acceptIf(null).to("bar")).to.throw("the key must be a string");
        done();
      });

      it("should throw an error if value is null", done => {
        expect(() => mapper("foo").acceptIf("foo").to("bar")).to.throw("the value cannot be undefined or null");
        done();
      });
    });

  });

  describe("rejectIf", () => {

    before(done => {
      mapper = createMapper();

      mapper
        .map("foo").rejectIf("voila", "a").to("bar")
        .map("foo").rejectIf("check", check => check > 5).to("bar1");

      source = {
        "foo": {
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        },
        "voila": "a",
        "check": 2
      };

      expected = {
        "bar1": {
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        }
      };
      done();
    });

    describe("when its used", () => {

      it("should return the desired result", done => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);
        done();
      });
    });

    describe("parameter validation", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error if key is null", done => {
        expect(() => mapper("foo").rejectIf(null).to("bar")).to.throw("the key must be a string");
        done();
      });

      it("should throw an error if value is null", done => {
        expect(() => mapper("foo").rejectIf("foo").to("bar")).to.throw("the value cannot be undefined or null");
        done();
      });
    });

  });


  describe("removing", () => {

    before(done => {
      mapper = createMapper();

      mapper
        .map("foo").removing(["id", "foo1"]).to("bar")
        .map(["foo", "h"]).removing(["id", "foo1"])
        .to("barMulti", foo => {
          return foo;
        })
        .map("fooArray").removing(["id"]).to("barArray")
        .map("h").or("howdy").removing(["id2"]).to("orTest")
        .map("howdy")
        .map("voila").to("voila", () => "hello");

      source = {
        "foo": {
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        },
        "fooArray": [{
          "id": "fooID",
          "bar": "tes",
          "foo1": "bar2"
        }],
        "howdy": {
          "id": "allow",
          "id2": "allow2"
        },
        "voila": "a"
      };

      expected = {
        "bar": {
          "bar": "tes"
        },
        "barArray": [
          {
            "bar": "tes",
            "foo1": "bar2"
          }
        ],
        "barMulti": {
          "bar": "tes"
        },
        "howdy": {
          "id": "allow",
          "id2": "allow2"
        },
        "orTest": {
          "id": "allow"
        },
        "voila": "hello"
      };
      done();
    });

    describe("when an object is passed", () => {

      it("should return the desired result", done => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);
        done();
      });
    });

    describe("when an array of object is passed", () => {

      it("should return the desired result", done => {
        actual = mapper.each([source]);
        expect(actual).to.equal([expected]);
        done();
      });
    });

    describe("parameter validation", () => {

      beforeEach(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error on null", done => {
        expect(() => mapper("foo").removing(null).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });

      it("should throw an error on undefined", done => {
        expect(() => mapper("foo").removing(undefined).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });

      it("should throw an error when keys are not passed in as valid string", done => {
        expect(() => mapper("foo").removing({}).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });

      it("should throw an error when keys are not passed in as valid array of strings", done => {
        expect(() => mapper("foo").removing([{}]).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });

    });

  });
});
