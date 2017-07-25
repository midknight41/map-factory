import * as Lab from "lab";
import { expect } from "code";
import createMapper from "../lib";

const { describe, it, before } = exports.lab = Lab.script();

let source;
let expected;
let mapper;
let actual;

describe("Pipeline transformations functionality of the mapper", () => {

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

    describe("when keys are null", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error", done => {
        expect(() => mapper("foo").removing(null).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });
    });

    describe("when keys are undefined", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error", done => {
        expect(() => mapper("foo").removing(undefined).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });
    });


    describe("when keys are not passed in as valid string", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error", done => {
        expect(() => mapper("foo").removing({}).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });
    });

    describe("when keys are not passed in as valid array of strings", () => {

      before(done => {
        mapper = createMapper();
        done();
      });

      it("should throw an error", done => {
        expect(() => mapper("foo").removing([{}]).to("bar")).to.throw("The removing method requires a string value or an array of strings");
        done();
      });
    });
  });
});
