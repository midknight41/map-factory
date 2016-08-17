import * as nodeunit from "nodeunit";
// tslint:disable-next-line no-var-requires
const createMapper = require("../lib/index");


const basicMappingGroup: nodeunit.ITestGroup = {

  "Can require the module from ES5 land": function (test: nodeunit.Test): void {

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
  "each method works from the index": function (test: nodeunit.Test): void {

    const source = [{
      "fieldName": "name1"
    }];

    const expected = [{
      "fieldName": "name1"
    }];

    const map = createMapper();

    const actual = map("fieldName").each(source);

    test.deepEqual(actual, expected);

    return test.done();
  }
};

exports.basicMapping = basicMappingGroup;
