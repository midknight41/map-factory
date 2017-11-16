import { expect } from "code";
import getHelper from "lab-testing";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";
import Mapping from "../../lib/mapping";
import Mapper from "../../lib/mapper";

const suite = labSuite.create();

suite.expect("EXPERIMENTAL").to.be.a.boolean();

suite.declare((lab, variables) => {

  const { EXPERIMENTAL } = variables;

  function createSut() {
    return createMapper({ experimental: EXPERIMENTAL });
  }

  // const experimentalLabel = EXPERIMENTAL === true ? "in experimental mode" : "in normal mode";

  const testing = getHelper(lab);
  const group = testing.createExperiment("interfaces");

  group("basic functionality", () => {

    lab.test("Can map one field that exists to another", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Throws if a null source is provided", done => {

      const map = createSut();

      map("fieldName").to("field.name");

      const throws = function () {

        map.execute(null);

      };

      expect(throws).to.throw();

      return done();
    });

    lab.test("Throws if an undefined source is provided", done => {

      const map = createSut();

      map("fieldName").to("field.name");

      const throws = function () {

        map.execute(undefined);

      };

      expect(throws).to.throw();

      return done();
    });

    lab.test("Can reuse map for different transform", done => {

      const source = {
        "fieldName": "name1"
      };

      const source2 = {
        "fieldName": "name2"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const expected2 = {
        "field": {
          "name": "name2"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.execute(source);
      const actual2 = map.execute(source2);

      expect(actual).to.equal(expected);
      expect(actual2).to.equal(expected2);

      return done();
    });

    lab.test("Can map from a source where source name is not formatted as a string", done => {

      const source = {
        country: "PL"
      };

      const expected = {
        "country": "PL"
      };

      const map = createSut();

      map("country").to("country");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("A field that doesn't exists on the source doesn't affect the resulting object", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name");
      map("fieldId").to("field.name");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("A field that doesn't exists on the source doesn't affect the resulting object when a pass-through transform is used", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name");
      map("fieldId").to("field.name", value => value);

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("A null source field should map the source to destination", done => {

      const map = createSut();

      const result = map(null).execute({"foo": "bar"});

      expect(result).to.equal({"foo": "bar"});

      return done();

    });


    lab.test("A no source field is provided should map the source to destination", done => {

      const map = createSut();

      const result = map().execute({"foo": "bar"});

      expect(result).to.equal({"foo": "bar"});

      return done();

    });

    lab.test(" A null source field can be used alongside a normal mapping", done => {

      const mapper = createSut();

      mapper.map(null).to("test")
        .map("foo").to("test.foo1");

      const result = mapper.execute({"foo": "bar"});

      expect(result).to.equal({
        "test": {
          "foo": "bar",
          "foo1": "bar"
        }
      });

      return done();

    });

    lab.test("A null target field throws an error", done => {

      const map = createSut();

      const throws = function () {

        map("fieldName").to(null);

      };

      expect(throws).to.throw(Error, "the target field name must be a string");

      return done();

    });

    lab.test("The source field is used if no target field is provided", done => {

      const source = {
        "fieldName": "name1"
      };

      const map = createSut();

      map("fieldName");

      const actual = map.execute(source);

      expect(actual).to.equal(source);

      return done();
    });

    lab.test("A source field can be mapped multiple times", done => {

      const source = {
        "fieldName": "name"
      };

      const expected = {
        "field": "name",
        "name": "name-long"
      };

      const map = createSut();

      map("fieldName").to("field");
      map("fieldName").to("name", value => `${value}-long`);

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });
  });

  group("alternate interfaces", () => {

    lab.test("default function and map() function are logically equivalent", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();
      const mapper = createSut();

      map("fieldName").to("field.name");
      mapper.map("fieldName").to("field.name");

      const defaultActual = map.execute(source);
      const functionActual = mapper.execute(source);

      expect(defaultActual).to.equal(expected);
      expect(defaultActual).to.equal(functionActual);

      return done();

    });

  });

  group("fluent chaining ", () => {

    lab.test("map() returns a chainable object", done => {

      const mapper = createSut();

      const actual = mapper.map("userId");

      expect(actual).to.not.be.null();
      expect(actual).to.be.instanceOf(Mapping);

      return done();

    });

    lab.test("to() returns a chainable object", done => {

      const mapper = createSut();

      const actual = mapper.map("userId").to("user.id");

      expect(actual).to.not.be.null();
      expect(actual).to.be.instanceOf(Mapper);

      return done();

    });

    lab.test("to() with a function returns a chainable object", done => {

      const mapper = createSut();

      const actual = mapper.map("userId").to("user.id", () => {
        return "a";
      });

      expect(actual).to.not.be.null();
      expect(actual).to.be.instanceOf(Mapper);

      return done();

    });

    lab.test("mapper can fluently chain call map() after the map() method", done => {

      const source = {
        "userId": 123,
        "userName": "my name"
      };

      const expected = {
        "userId": 123,
        "name": "my name"
      };

      const mapper = createSut();

      mapper
        .map("userId")
        .map("userName").to("name");

      const actual = mapper.execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("mapper can fluently chain call map() after the to() method", done => {

      const source = {
        "userId": 123,
        "userName": "my name"
      };

      const expected = {
        "id": 123,
        "name": "my name"
      };

      const mapper = createSut();

      mapper
        .map("userId").to("id")
        .map("userName").to("name");

      const actual = mapper.execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("mapper can fluently chain call execute() after the to() method", done => {

      const source = {
        "userId": 123,
        "userName": "my name"
      };

      const expected = {
        "id": 123,
        "name": "my name"
      };

      const mapper = createSut();

      const actual = mapper
        .map("userId").to("id")
        .map("userName").to("name")
        .execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("mapper can fluently chain call execute() after the map() method", done => {

      const source = {
        "userId": 123
      };

      const expected = {
        "userId": 123
      };

      const mapper = createSut();

      const actual = mapper
        .map("userId")
        .execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

  });

  group("The each() method", () => {

    lab.test("Can process an array correctly", done => {
      const source = [{
        "fieldName": "name1"
      }, {
        "fieldName": "name2"
      }];

      const expected = [
        {
          "field": {
            "name": "name1"
          }
        },
        {
          "field": {
            "name": "name2"
          }
        }];

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.each(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("An empty array does not cause an error", done => {
      const source = [];

      const expected = [];

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.each(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("Multiple mappers can be used together", done => {
      const source = {
        one: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }],
        two: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }],
        three: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }]
      };

      const expected = {
        one: [{ newOne: "a" }, { newOne: "b" }, { newOne: "c" }],
        two: [{ newOne: "a" }, { newOne: "b" }, { newOne: "c" }],
        three: [{ newOne: "a" }, { newOne: "b" }, { newOne: "c" }]
      };

      const mainMapper = createSut();
      const childMapper = createSut();

      childMapper
        .map("value").to("newOne");

      mainMapper
        .map("one").to("one", array => childMapper.each(array))
        .map("two").to("two", array => childMapper.each(array))
        .map("three").to("three", array => childMapper.each(array));

      const actual = mainMapper.execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("An undefined parameter does not throw an error", done => {
      const map = createSut();

      map("fieldName").to("field.name");

      expect(map.each(undefined)).to.equal(null);

      return done();
    });

    lab.test("A null parameter does not throw an error", done => {
      const map = createSut();

      map("fieldName").to("field.name");

      expect(map.each(null)).to.equal(null);

      return done();
    });

    lab.test("A non-array throws an error", done => {
      const map = createSut();
      const source = { "a": "b" };

      map("fieldName").to("field.name");


      const throws = function () {
        map.each(source);
      };

      expect(throws).to.throw();

      return done();
    });
  });

  group("source and destination", () => {

    lab.test("Can map fields from a source onto an existing destination object", done => {

      const source = {
        "fieldName": "name1"
      };

      const destination = {
        "existing": "field"
      };

      const expected = {
        "field": {
          "name": "name1"
        },
        "existing": "field"
      };

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.execute(source, destination);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Can map a field from source over an existing field on a destination object", done => {

      const source = {
        "fieldName": "name1"
      };

      const destination = {
        "field": {
          "name": "wrong"
        }
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name");

      const actual = map.execute(source, destination);

      expect(actual).to.equal(expected);

      return done();
    });
  });

  group("custom functions", () => {

    lab.test("Calls a function and alters the resulting object", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "altered"
        }
      };

      const map = createSut();

      map("fieldName").to("field.name", () => "altered");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Calls a default function and alters the resulting object", done => {

      const source = {
        "foo": "name1",
        "bar": "name2"
      };

      const expected = {
        "foo1": "bar",
        "foo2": "bar",
        "foo3": "bar",
        "fooOr": "barOr",
        "foo4": "foo4"
      };

      const mapper = createSut();

      mapper
        .map("foo1").to("foo1", null, "bar")
        .map("foo2").to("foo2", null, () => "bar")
        .map(["foo1", "foo2"]).to("foo3", () => "check", "bar")
        .map("foo1").or("foo2").to("fooOr", null, "barOr")
        .map("foo4").always.to("foo4", () => "foo4", () => "bar")
        .map("foo5").to("foo5", null, () => null)
        .map("foo6").to("foo6", null, null);

      const actual = mapper.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });
  });

  group("multiple selections", () => {

    lab.test("Can extract multiple selections into a single transform", done => {

      const source = {
        "group1": {
          "name": "A"
        },
        "group2": {
          "name": "B"
        }
      };

      const expected = {
        "merged": { "names": ["A", "B"] }
      };

      const map = createSut();

      map(["group1", "group2"]).to("merged", (group1, group2) => {
        return { "names": [group1.name, group2.name] };
      });

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Can extract multiple selections into a single transform while allowing simpler mappings to work", done => {

      const source = {
        "person": {
          "name": "joe"
        },
        "group1": {
          "name": "A"
        },
        "group2": {
          "name": "B"
        }
      };

      const expected = {
        "name": "joe",
        "merged": { "groups": ["A", "B"] }
      };

      const map = createSut();

      map("person.name").to("name");
      map(["group1", "group2"]).to("merged", (group1, group2) => {
        return { "groups": [group1.name, group2.name] };
      });

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("If multiple selections aren't mapped to a transform and error will occur", done => {

      const source = {
        "person": {
          "name": "joe"
        },
        "group1": {
          "name": "A"
        },
        "group2": {
          "name": "B"
        }
      };

      const map = createSut();

      map("person.name").to("name");
      map(["group1", "group2"]).to("merged");

      const throws = function () {

        map.execute(source);
      };

      expect(throws).to.throw();

      return done();
    });
  });

  group("The or() method", () => {

    lab.test("Maps the first item if it is present", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("fieldName").or("noField").to("field.name");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();

    });

    lab.test("to method can use a transform if provided with first item", done => {
      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "altered name1"
        }
      };

      const map = createSut();

      map("fieldName").or("noField").to("field.name", value => `altered ${value}`);

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Maps the second item if the first item isn't present", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("noField").or("fieldName").to("field.name");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Maps the last item in a very long chain", done => {

      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "name1"
        }
      };

      const map = createSut();

      map("a").or("b").or("c").or("d").or("e").or("fieldName").to("field.name");

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("to method can use a transform if provided with subsequent item", done => {
      const source = {
        "fieldName": "name1"
      };

      const expected = {
        "field": {
          "name": "altered name1"
        }
      };

      const map = createSut();

      map("noField").or("fieldName").to("field.name", value => `altered ${value}`);

      const actual = map.execute(source);

      expect(actual).to.equal(expected);

      return done();
    });

    lab.test("Throws if the initial source field is an array", done => {

      const map = createSut();


      const throws = function () {

        map(["a", "b"]).or("fieldName").to("field.name");

      };

      expect(throws).to.throw();

      done();

    });

    lab.test("Throws if and subsequent source field is an array", done => {

      const map = createSut();

      const throws = function () {

        map("fieldName").or(["a", "b"]).to("field.name");

      };

      expect(throws).to.throw();

      done();
    });

    lab.test("Throws if source is null", done => {
      const map = createSut();

      const throws = function () {

        map("fieldName").or(null).to("field.name");

      };

      expect(throws).to.throw();

      done();

    });

    lab.test("Throws if source is undefined", done => {
      const map = createSut();

      const throws = function () {

        map("fieldName").or(undefined).to("field.name");

      };

      expect(throws).to.throw();

      done();

    });

  });

  // PORTED TESTS

  group("ported object-mapper tests", () => {
    lab.test("mapping - map and append full array to existing mapped array", done => {
      const obj = {
        thing: [
          { a: "a1", i: "b1" },
          { a: "a2", i: "b2" },
          { a: "a3", i: "b3" }
        ],
        thingOther: [
          { a: "a4", i: "b4" },
          { a: "a5", i: "b5" },
          { a: "a6", i: "b6" }
        ]
      };

      const expected = {
        "thing2": [
          [
            { a: "a1", i: "b1" },
            { a: "a2", i: "b2" },
            { a: "a3", i: "b3" }
          ],
          [
            { a: "a4", i: "b4" },
            { a: "a5", i: "b5" },
            { a: "a6", i: "b6" }
          ]
        ]
      };

      const map = createSut();

      map("thing").to("thing2[]+");
      map("thingOther").to("thing2[]+");

      const result = map.execute(obj);

      expect(result).to.equal(expected);
      return done();
    });

    lab.test("map object to another - allow null values", done => {
      const obj = {
        "a": 1234,
        "foo": {
          "bar": null
        }
      };

      const expected = {
        foo: {
          a: 1234
        },
        bar: {
          bar: null
        }
      };

      const map = createSut();

      map("foo.bar").always.to("bar.bar?");
      map("a").to("foo.a");

      const result = map.execute(obj);

      expect(result).to.equal(expected);
      return done();
    });

    lab.test("map object to another - with three destinations for same value", done => {
      const baseObject = {
        test: 1
      };

      const obj = {
        "foo": {
          "bar": "baz"
        }
      };

      const expected = {
        test: 1,
        bar: {
          foo: [{
            baz: "baz",
            foo: "baz",
            bar: ["baz"]
          }]
        }
      };

      const map = createSut();

      map("foo.bar").to("bar.foo[].baz");
      map("foo.bar").to("bar.foo[].foo");
      map("foo.bar").to("bar.foo[].bar[]");

      const result = map.execute(obj, baseObject);

      expect(result).to.equal(expected);
      return done();
    });

  });

});

export default suite;
