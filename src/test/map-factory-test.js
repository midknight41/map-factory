import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory");

import createMapper from "../lib/map-factory";
import Mapping from "../lib/mapping";
import Mapper from "../lib/mapper";

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

    const map = createMapper();
    const mapper = createMapper();

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

    const mapper = createMapper();

    const actual = mapper.map("userId");

    expect(actual).to.not.be.null();
    expect(actual).to.be.instanceOf(Mapping);

    return done();

  });

  lab.test("to() returns a chainable object", done => {

    const mapper = createMapper();

    const actual = mapper.map("userId").to("user.id");

    expect(actual).to.not.be.null();
    expect(actual).to.be.instanceOf(Mapper);

    return done();

  });

  lab.test("to() with a function returns a chainable object", done => {

    const mapper = createMapper();

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

    const mapper = createMapper();

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

    const mapper = createMapper();

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

    const mapper = createMapper();

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

    const mapper = createMapper();

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

    const map = createMapper();

    map("fieldName").to("field.name");

    const actual = map.each(source);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("An empty array does not cause an error", done => {
    const source = [];

    const expected = [];

    const map = createMapper();

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

    const mainMapper = createMapper();
    const childMapper = createMapper();

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

  lab.test("A null parameter throws an error", done => {
    const map = createMapper();

    map("fieldName").to("field.name");

    const throws = function () {
      map.each(null);
    };

    expect(throws).to.throw();

    return done();
  });

  lab.test("A non-array throws an error", done => {
    const map = createMapper();
    const source = { "a": "b" };

    map("fieldName").to("field.name");


    const throws = function () {
      map.each(source);
    };

    expect(throws).to.throw();

    return done();
  });
});

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

    const map = createMapper();

    map("fieldName").to("field.name");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("Throws if a null source is provided", done => {

    const map = createMapper();

    map("fieldName").to("field.name");

    const throws = function () {

      map.execute(null);

    };

    expect(throws).to.throw();

    return done();
  });

  lab.test("Throws if an undefined source is provided", done => {

    const map = createMapper();

    map("fieldName").to("field.name");

    const throws = function () {

      map.execute(undefined);

    };

    expect(throws).to.throw();

    return done();
  });

  lab.test("Can reuse the map for multiple transforms", done => {

    const source = {
      "fieldName": "name1"
    };

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper();

    map("fieldName").to("field.name");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

    map("fieldName").to("field.name");
    map("fieldId").to("field.name");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("A null source field throws an error", done => {

    const map = createMapper();

    const throws = function () {

      map(null).to("field.name");

    };

    expect(throws).to.throw();

    return done();

  });

  lab.test("A null target field throws an error", done => {

    const map = createMapper();

    const throws = function () {

      map("fieldName").to(null);

    };

    expect(throws).to.throw();

    return done();

  });

  lab.test("The source field is used if no target field is provided", done => {

    const source = {
      "fieldName": "name1"
    };

    const map = createMapper();

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

    const map = createMapper();

    map("fieldName").to("field");
    map("fieldName").to("name", value => `${value}-long`);

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

    map("fieldName").to("field.name", () => "altered");

    const actual = map.execute(source);

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

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

    const map = createMapper();

    map("noField").or("fieldName").to("field.name", value => `altered ${value}`);

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("Throws if the initial source field is an array", done => {

    const map = createMapper();


    const throws = function () {

      map(["a", "b"]).or("fieldName").to("field.name");

    };

    expect(throws).to.throw();

    done();

  });

  lab.test("Throws if and subsequent source field is an array", done => {

    const map = createMapper();

    const throws = function () {

      map("fieldName").or(["a", "b"]).to("field.name");

    };

    expect(throws).to.throw();

    done();
  });

  lab.test("Throws if source is null", done => {
    const map = createMapper();

    const throws = function () {

      map("fieldName").or(null).to("field.name");

    };

    expect(throws).to.throw();

    done();

  });

  lab.test("Throws if source is undefined", done => {
    const map = createMapper();

    const throws = function () {

      map("fieldName").or(undefined).to("field.name");

    };

    expect(throws).to.throw();

    done();

  });
});
