import * as nodeunit from "nodeunit";
import createMapper from "../lib/map-factory";
// var createMapper = require("../lib/index");

const basicMappingGroup: nodeunit.ITestGroup = {
  "Can map one field that exists to another": function (test: nodeunit.Test): void {
    const source = {
      "fieldName"
      : "name1"
    };

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper(source);

    map("fieldName").to("field.name");

    const actual = map.execute();

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

    const map = createMapper(source);

    map("fieldName").to("field.name");
    map("fieldId").to("field.name");

    const actual = map.execute();

    test.deepEqual(actual, expected);
    test.done();
  },
  "A null source field throws an error": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
    };

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper(source);

    test.throws(() => {

      map(null).to("field.name");

    });

    test.done();

  },
  "A null target field throws an error": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
    };

    const expected = {
      "field": {
        "name": "name1"
      }
    };

    const map = createMapper(source);

    test.throws(() => {

      map("fieldName").to(null);

    });

    test.done();

  },
  "The source field is used if not target field is provided": function (test: nodeunit.Test): void {
    const source = {
      "fieldName": "name1",
    };
    
    const map = createMapper(source);

    map("fieldName");

    const actual = map.execute();

    test.deepEqual(actual, source, "field was not mapped to new object");
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

    const map = createMapper(source);

    map("fieldName").to("field.name", value =>  "altered");

    const actual = map.execute();

    test.deepEqual(actual, expected, "field was not mapped to new object");
    test.done();

  }
}

exports.basicMapping = basicMappingGroup;
exports.customFunctions = customFunctionsGroup;
