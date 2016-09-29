import * as nodeunit from "nodeunit";
import createMapper from "../lib/map-factory";
import Mapper from "../lib/mapper";
import Mapping from "../lib/mapping";

const mapGroup: nodeunit.ITestGroup = {

  "default function and map() function are logically equivalent": function (test: nodeunit.Test): void {

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

    test.deepEqual(defaultActual, expected);
    test.deepEqual(defaultActual, functionActual);

    return test.done();

  }
};

const fluentChainingGroup: nodeunit.ITestGroup = {

  "map() returns a chainable object": function (test: nodeunit.Test): void {

    const mapper = createMapper();

    const actual = mapper.map("userId");

    test.notEqual(actual, null);
    test.equal(actual instanceof Mapping, true);

    return test.done();

  },
  "to() returns a chainable object": function (test: nodeunit.Test): void {

    const mapper = createMapper();

    const actual = mapper.map("userId").to("user.id");

    test.notEqual(actual, null);
    test.equal(actual instanceof Mapper, true);

    return test.done();

  },
  "to() with a function returns a chainable object": function (test: nodeunit.Test): void {

    const mapper = createMapper();

    const actual: Object = mapper.map("userId").to("user.id", value => {
      return "a";
    });

    test.notEqual(actual, null);
    test.equal(actual instanceof Mapper, true);

    return test.done();

  },
  "mapper can fluently chain call map() after the map() method": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();

  },
  "mapper can fluently chain call map() after the to() method": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();

  },
  "mapper can fluently chain call execute() after the to() method": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();

  },
  "mapper can fluently chain call execute() after the map() method": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();

  }

};

const eachGroup: nodeunit.ITestGroup = {

  "Can process an array correctly": function (test: nodeunit.Test): void {
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

    test.deepEqual(actual, expected);

    return test.done();

  },
  "An empty array does not cause an error": function (test: nodeunit.Test): void {
    const source = [];

    const expected = [];

    const map = createMapper();

    map("fieldName").to("field.name");

    const actual = map.each(source);

    test.deepEqual(actual, expected);

    return test.done();

  },
  "Multiple mappers can be used together": function (test: nodeunit.Test): void {
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

    test.deepEqual(actual, expected);

    return test.done();

  },
  "A null parameter throws an error": function (test: nodeunit.Test): void {
    const map = createMapper();

    map("fieldName").to("field.name");

    test.throws(() => {
      const actual = map.each(null);
    });

    return test.done();
  },
  "A non-array throws an error": function (test: nodeunit.Test): void {
    const map = createMapper();
    const source: any = { "a": "b" };

    map("fieldName").to("field.name");

    test.throws(() => {
      const actual = map.each(source);
    });

    return test.done();
  }
};

const defaultGroup: nodeunit.ITestGroup = {

  "Can map one field that exists to another": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();
  },
  "Throws if a null source is provided": function (test: nodeunit.Test): void {

    const map = createMapper();

    map("fieldName").to("field.name");

    test.throws(() => {
      const actual = map.execute(null);
    });

    return test.done();
  },
  "Throws if an undefined source is provided": function (test: nodeunit.Test): void {

    const map = createMapper();

    map("fieldName").to("field.name");

    test.throws(() => {
      const actual = map.execute(undefined);
    });

    return test.done();
  },
  "Can reuse the map for multiple transforms": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();
  },

  "Can reuse map for different transform": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);
    test.deepEqual(actual2, expected2);

    return test.done();
  },

  "Can map from a source where source name is not formatted as a string": function (test: nodeunit.Test): void {

    const source = {
      country: "PL"
    };

    const expected = {
      "country": "PL"
    };

    const map = createMapper();

    map("country").to("country");

    const actual = map.execute(source);

    test.deepEqual(actual, expected);

    return test.done();
  },

  "A field that doesn't exists on the source doesn't affect the resulting object": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();
  },

  "A null source field throws an error": function (test: nodeunit.Test): void {

    const map = createMapper();

    test.throws(() => {

      map(null).to("field.name");

    });

    return test.done();

  },

  "A null target field throws an error": function (test: nodeunit.Test): void {

    const map = createMapper();

    test.throws(() => {

      map("fieldName").to(null);

    });

    return test.done();

  },

  "The source field is used if no target field is provided": function (test: nodeunit.Test): void {

    const source = {
      "fieldName": "name1"
    };

    const map = createMapper();

    map("fieldName");

    const actual = map.execute(source);

    test.deepEqual(actual, source, "field was not mapped to new object");

    return test.done();
  }
};


const sourceAndDestinationGroup: nodeunit.ITestGroup = {

  "Can map fields from a source onto an existing destination object": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();
  },

  "Can map a field from source over an existing field on a destination object": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected);

    return test.done();
  }
};


const customFunctionsGroup: nodeunit.ITestGroup = {

  "Calls a function and alters the resulting object": function (test: nodeunit.Test): void {

    const source = {
      "fieldName": "name1"
    };

    const expected = {
      "field": {
        "name": "altered"
      }
    };

    const map = createMapper();

    map("fieldName").to("field.name", value => "altered");

    const actual = map.execute(source);

    test.deepEqual(actual, expected, "field was not mapped to new object");

    return test.done();
  }
};

const multipleSelectionGroup: nodeunit.ITestGroup = {

  "Can extract multiple selections into a single transform": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected, "field was not mapped to new object");

    return test.done();
  },

  "Can extract multiple selections into a single transform while allowing simpler mappings to work": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected, "field was not mapped to new object");

    return test.done();
  },

  "If multiple selections aren't mapped to a transform and error will occur": function (test: nodeunit.Test): void {

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
    map(["group1", "group2"]).to("merged");

    test.throws(() => {
      const actual = map.execute(source);
    });

    return test.done();
  }
};

const orMethodGroup: nodeunit.ITestGroup = {

  "Maps the first item if it is present": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected, "or method has not selected the first item.");

    return test.done();

  },
  "to method can use a transform if provided with first item": function (test: nodeunit.Test): void {
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

    test.deepEqual(actual, expected, "or method has not selected the first item.");

    return test.done();
  },
  "Maps the second item if the first item isn't present": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected, "or method has not selected the second item.");

    return test.done();
  },
  "Maps the last item in a very long chain": function (test: nodeunit.Test): void {

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

    test.deepEqual(actual, expected, "or method has not selected the second item.");

    return test.done();
  },
  "to method can use a transform if provided with subsequent item": function (test: nodeunit.Test): void {
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

    test.deepEqual(actual, expected, "or method has not selected the first item.");

    return test.done();
  },
  "Throws if the initial source field is an array": function (test: nodeunit.Test): void {

    const map = createMapper();


    test.throws(() => {

      map(["a", "b"]).or("fieldName").to("field.name");

    });

    test.done();

  },
  "Throws if and subsequent source field is an array": function (test: nodeunit.Test): void {

    const map: any = createMapper();

    test.throws(() => {

      map("fieldName").or(["a", "b"]).to("field.name");

    });

    test.done();
  },
  "Throws if source is null": function (test: nodeunit.Test): void {
    const map: any = createMapper();

    test.throws(() => {

      map("fieldName").or(null).to("field.name");

    });

    test.done();

  },
  "Throws if source is undefined": function (test: nodeunit.Test): void {
    const map: any = createMapper();

    test.throws(() => {

      map("fieldName").or(undefined).to("field.name");

    });

    test.done();

  }
};

exports.basicMapping = defaultGroup;
exports.mapMethod = mapGroup;
exports.sourceAndDestination = sourceAndDestinationGroup;
exports.customFunctions = customFunctionsGroup;
exports.multipleSelection = multipleSelectionGroup;
exports.fluentChaining = fluentChainingGroup;
exports.each = eachGroup;
exports.orMethod = orMethodGroup;
