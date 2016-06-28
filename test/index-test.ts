import * as nodeunit from "nodeunit";
const createMapper = require("../lib/index");

const basicMappingGroup: nodeunit.ITestGroup = {

  "Can require the module from ES5 land": function (test: nodeunit.Test): void {
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
  }

}

exports.basicMapping = basicMappingGroup;
