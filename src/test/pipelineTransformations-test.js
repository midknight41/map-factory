import * as Lab from "lab";
import {expect} from "code";
import createMapper from "../lib";

const {describe, it, before, beforeEach} = exports.lab = Lab.script();

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
        .map("foo").acceptIf("check", check => check > 5).to("bar1")
        .map("foo").acceptIf("check", check => check > 1).to("bar2");

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
        },
        "bar2": {
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
        .map("foo").rejectIf("check", check => check > 5).to("bar1")
        .map("foo").rejectIf("check", check => check > 1).to("bar2");

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

  describe("compact", () => {

    it("should compact and array with falsy values", done => {

      const input = [null, "a", false, "b", undefined, "c"];

      expected = ["a", "b", "c"];

      mapper = createMapper();

      actual = mapper
        .map("[]").compact()
        .execute(input);

      expect(actual).to.equal(expected);
      done();

    });

    it("should return an unmodified value if the source value is not an array", done => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").compact()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });

    it("should not error if the source value isn't found", done => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").compact()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });

  });

  describe("first", () => {

    it("should select the first item in an array", done => {

      const input = ["a", "b", "c"];

      expected = {data: "a"};

      mapper = createMapper();

      actual = mapper
        .map("[]").first().to("data")
        .execute(input);

      expect(actual).to.equal(expected);
      done();

    });

    it("should return an unmodified value if the source value is not an array", done => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").first()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });

    it("should not error if the source value isn't found", done => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").first()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });
  });

  describe("last", () => {

    it("should select the first item in an array", done => {

      const input = ["a", "b", "c"];

      expected = {data: "c"};

      mapper = createMapper();

      actual = mapper
        .map("[]").last().to("data")
        .execute(input);

      expect(actual).to.equal(expected);
      done();

    });

    it("should return an unmodified value if the source value is not an array", done => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").last()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });

    it("should not error if the source value isn't found", done => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").last()
        .execute(input);

      expect(actual).to.equal(input);
      done();

    });
  });

  describe("keep", () => {

    before(done => {
      mapper = createMapper();

      mapper
        .map("foo").keep(["foo1"]).to("bar")
        .map(["foo", "h"]).keep(["bar"])
        .to("barMulti", foo => {
          return foo;
        })
        .map("fooArray").keep(["bar", "foo1"]).to("barArray")
        .map("h").or("howdy").keep(["id"]).to("orTest")
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
          "foo1": "bar2"
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
        expect(() => mapper("foo").keep(null).to("bar")).to.throw("The keep method requires a string value or an array of strings");
        done();
      });

      it("should throw an error on undefined", done => {
        expect(() => mapper("foo").keep(undefined).to("bar")).to.throw("The keep method requires a string value or an array of strings");
        done();
      });

      it("should throw an error when keys are not passed in as valid string", done => {
        expect(() => mapper("foo").keep({}).to("bar")).to.throw("The keep method requires a string value or an array of strings");
        done();
      });

      it("should throw an error when keys are not passed in as valid array of strings", done => {
        expect(() => mapper("foo").keep([{}]).to("bar")).to.throw("The keep method requires a string value or an array of strings");
        done();
      });

    });

  });

});
