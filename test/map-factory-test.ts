import * as nodeunit from "nodeunit";
import createMapper from "../lib/map-factory";
// var createMapper = require("../lib/index");

const basicMappingGroup: nodeunit.ITestGroup = {
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
    test.done();
  },
  "Throws if no source is provided": function (test: nodeunit.Test): void {

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper();

    map("fieldName").to("field.name");

    test.throws(() => {
      const actual = map.execute();
    });

    test.done();
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
    test.done();
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

    test.done();
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
    test.done();
  },
  "A field that doesn't exists on the source doesn't affect the resulting object": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
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
    test.done();
  },
  "A null source field throws an error": function (test: nodeunit.Test): void {

    const map = createMapper();

    test.throws(() => {

      map(null).to("field.name");

    });

    test.done();

  },
  "A null target field throws an error": function (test: nodeunit.Test): void {

    const map = createMapper();

    test.throws(() => {

      map("fieldName").to(null);

    });

    test.done();

  },
  "The source field is used if no target field is provided": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
    };

    const map = createMapper();

    map("fieldName");

    const actual = map.execute(source);

    test.deepEqual(actual, source, "field was not mapped to new object");
    test.done();

  }

}


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
    test.done();

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
    test.done();

  }
}


const customFunctionsGroup: nodeunit.ITestGroup = {
  "Calls a function and alters the resulting object": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
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
    test.done();

  }
}

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
    test.done();

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
    test.done();

  },
  "If Multiple selections aren't mapped to a transform and error will occur": function (test: nodeunit.Test): void {

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

    test.done();

  }
}

exports.basicMapping = basicMappingGroup;
exports.sourceAndDestination = sourceAndDestinationGroup;
exports.customFunctions = customFunctionsGroup;
exports.multipleSelection = multipleSelectionGroup;
