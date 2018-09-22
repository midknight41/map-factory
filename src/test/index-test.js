import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory");

const createMapper = require("../lib/index");
const { getValue, setValue } = require("../lib/index");

group("non-import compatibility", () => {

  lab.test("Can require the module", () => {

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
  });

  lab.test("each() method works from the index", () => {

    const source = [{
      "fieldName": "name1"
    }];

    const expected = [{
      "fieldName": "name1"
    }];

    const map = createMapper();

    const actual = map("fieldName").each(source);

    expect(actual).to.equal(expected);
  });

  lab.test("getValue is exported", () => {

    expect(getValue).to.be.a.function();
  });

  lab.test("setValue is exported", () => {

    expect(setValue).to.be.a.function();
  });

});
