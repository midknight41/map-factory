import * as Lab from "@hapi/lab";
import {expect} from "@hapi/code";
import createMapper from "../lib";

const {describe, it, before, beforeEach} = exports.lab = Lab.script();

let source;
let expected;
let mapper;
let actual;

describe("Pipeline Transformations", () => {

  describe("The accceptIf() method", () => {

    before(() => {
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
    });

    describe("when its used", () => {

      it("should return the desired result", () => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);

      });
    });

    describe("parameter validation", () => {

      before(() => {
        mapper = createMapper();

      });

      it("should throw an error if key is null", () => {
        expect(() => mapper("foo").acceptIf(null).to("bar")).to.throw("the key must be a string");

      });

      it("should throw an error if value is null", () => {
        expect(() => mapper("foo").acceptIf("foo").to("bar")).to.throw("the value cannot be undefined or null");

      });
    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).acceptIf("foo", 2)).to.throw("Multiple selections does not support pipeline transformations");

      });
    });

  });

  describe("The rejectIf() method", () => {

    before(() => {
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
    });

    describe("when its used", () => {

      it("should return the desired result", () => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);

      });
    });

    describe("parameter validation", () => {

      before(() => {
        mapper = createMapper();

      });

      it("should throw an error if key is null", () => {
        expect(() => mapper("foo").rejectIf(null).to("bar")).to.throw("the key must be a string");

      });

      it("should throw an error if value is null", () => {
        expect(() => mapper("foo").rejectIf("foo").to("bar")).to.throw("the value cannot be undefined or null");

      });
    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).rejectIf("foo", 2)).to.throw("Multiple selections does not support pipeline transformations");

      });
    });

  });

  describe("The removing() method", () => {

    before(() => {
      mapper = createMapper();

      mapper
        .map("foo").removing(["id", "foo1"]).to("bar")
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
        "howdy": {
          "id": "allow",
          "id2": "allow2"
        },
        "orTest": {
          "id": "allow"
        },
        "voila": "hello"
      };
    });

    describe("when an object is passed", () => {

      it("should return the desired result", () => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);

      });
    });

    describe("when an array of object is passed", () => {

      it("should return the desired result", () => {
        actual = mapper.each([source]);
        expect(actual).to.equal([expected]);

      });
    });

    describe("parameter validation", () => {

      beforeEach(() => {
        mapper = createMapper();

      });

      it("should throw an error on null", () => {
        expect(() => mapper("foo").removing(null).to("bar")).to.throw("The removing method requires a string value or an array of strings");

      });

      it("should throw an error on undefined", () => {
        expect(() => mapper("foo").removing(undefined).to("bar")).to.throw("The removing method requires a string value or an array of strings");

      });

      it("should throw an error when keys are not passed in as valid string", () => {
        expect(() => mapper("foo").removing({}).to("bar")).to.throw("The removing method requires a string value or an array of strings");

      });

      it("should throw an error when keys are not passed in as valid array of strings", () => {
        expect(() => mapper("foo").removing([{}]).to("bar")).to.throw("The removing method requires a string value or an array of strings");

      });

    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).removing("foo")).to.throw("Multiple selections does not support pipeline transformations");

      });
    });

  });

  describe("The compact() method", () => {

    it("should compact and array with falsy values", () => {

      const input = [null, "a", false, "b", undefined, "c"];

      expected = ["a", "b", "c"];

      mapper = createMapper();

      actual = mapper
        .map("[]").compact()
        .execute(input);

      expect(actual).to.equal(expected);

    });

    it("should return an unmodified value if the source value is not an array", () => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").compact()
        .execute(input);

      expect(actual).to.equal(input);

    });

    it("should not error if the source value isn't found", () => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").compact()
        .execute(input);

      expect(actual).to.equal(input);

    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).compact()).to.throw("Multiple selections does not support pipeline transformations");

      });
    });

  });

  describe("The first() method", () => {

    it("should select the first item in an array", () => {

      const input = ["a", "b", "c"];

      expected = {data: "a"};

      mapper = createMapper();

      actual = mapper
        .map("[]").first().to("data")
        .execute(input);

      expect(actual).to.equal(expected);

    });

    it("should return an unmodified value if the source value is not an array", () => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").first()
        .execute(input);

      expect(actual).to.equal(input);

    });

    it("should not error if the source value isn't found", () => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").first()
        .execute(input);

      expect(actual).to.equal(input);

    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).first()).to.throw("Multiple selections does not support pipeline transformations");

      });
    });
  });

  describe("The last() method", () => {

    it("should select the first item in an array", () => {

      const input = ["a", "b", "c"];

      expected = {data: "c"};

      mapper = createMapper();

      actual = mapper
        .map("[]").last().to("data")
        .execute(input);

      expect(actual).to.equal(expected);

    });

    it("should return an unmodified value if the source value is not an array", () => {
      const input = {data: {"first": "value", "second": null}};
      mapper = createMapper();

      actual = mapper
        .map("data").last()
        .execute(input);

      expect(actual).to.equal(input);

    });

    it("should not error if the source value isn't found", () => {
      const input = {};
      mapper = createMapper();

      actual = mapper
        .map("data").last()
        .execute(input);

      expect(actual).to.equal(input);

    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).last()).to.throw("Multiple selections does not support pipeline transformations");

      });
    });
  });

  describe("The keep() method", () => {

    before(() => {
      mapper = createMapper();

      mapper
        .map("foo").keep(["foo1", "foo2"]).to("bar")
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
        "howdy": {
          "id": "allow",
          "id2": "allow2"
        },
        "orTest": {
          "id": "allow"
        },
        "voila": "hello"
      };
    });

    describe("when an object is passed", () => {

      it("should return the desired result", () => {
        actual = mapper.execute(source);
        expect(actual).to.equal(expected);

      });
    });

    describe("when an array of object is passed", () => {

      it("should return the desired result", () => {
        actual = mapper.each([source]);
        expect(actual).to.equal([expected]);

      });
    });

    describe("parameter validation", () => {

      beforeEach(() => {
        mapper = createMapper();

      });

      it("should throw an error on null", () => {
        expect(() => mapper("foo").keep(null).to("bar")).to.throw("The keep method requires a string value or an array of strings");

      });

      it("should throw an error on undefined", () => {
        expect(() => mapper("foo").keep(undefined).to("bar")).to.throw("The keep method requires a string value or an array of strings");

      });

      it("should throw an error when keys are not passed in as valid string", () => {
        expect(() => mapper("foo").keep({}).to("bar")).to.throw("The keep method requires a string value or an array of strings");

      });

      it("should throw an error when keys are not passed in as valid array of strings", () => {
        expect(() => mapper("foo").keep([{}]).to("bar")).to.throw("The keep method requires a string value or an array of strings");

      });

    });

    describe("when multiple sources are provided", () => {
      before(() => {
        mapper = createMapper();

      });

      it("should throw an error", () => {
        expect(() => mapper.map(["foo", "bar"]).keep("foo")).to.throw("Multiple selections does not support pipeline transformations");

      });
    });

  });

  describe("The sort() method", () => {
    describe("when the value is not an array", () => {
      it("should return the value without any change", () => {
        source = {"foo": "bar"};
        mapper = createMapper();

        mapper
          .map("foo").sort();

        expect(mapper.execute(source)).to.equal(source);
      });
    });

    describe("when the value is an array but no comparer is provided", () => {
      it("should return the sorted value", () => {
        source = {"foo": ["war", "bar"]};
        expected = {"foo": ["bar", "war"]};
        mapper = createMapper();

        mapper
          .map("foo").sort();

        expect(mapper.execute(source)).to.equal(expected);
      });
    });

    describe("when the value is an array and a comparer is provided", () => {
      it("should return the sorted value", () => {
        source = {
          "foo": [{
            "x": 4
          }, {
            "x": 2
          }]
        };
        expected = {
          "foo": [{
            "x": 2
          }, {
            "x": 4
          }]
        };
        mapper = createMapper();

        mapper
          .map("foo").sort(item => item.x);

        expect(mapper.execute(source)).to.equal(expected);
      });
    });
  });

  describe("The reverseSort() method", () => {
    describe("when the value is not an array", () => {
      it("should return the value without any change", () => {
        source = {"foo": "bar"};
        mapper = createMapper();

        mapper
          .map("foo").reverseSort();

        expect(mapper.execute(source)).to.equal(source);
      });
    });

    describe("when the value is an array but no comparer is provided", () => {
      it("should return the sorted value", () => {
        expected = {"foo": ["war", "bar"]};
        source = {"foo": ["bar", "war"]};
        mapper = createMapper();

        mapper
          .map("foo").reverseSort();

        expect(mapper.execute(source)).to.equal(expected);
      });
    });

    describe("when the value is an array and a comparer is provided", () => {
      it("should return the sorted value", () => {
        expected = {
          "foo": [{
            "x": 4
          }, {
            "x": 2
          }]
        };
        source = {
          "foo": [{
            "x": 2
          }, {
            "x": 4
          }]
        };
        mapper = createMapper();

        mapper
          .map("foo").reverseSort(item => item.x);

        expect(mapper.execute(source)).to.equal(expected);
      });
    });
  });
});
