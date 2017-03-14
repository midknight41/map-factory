import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory");

const createMapper = require("../lib/index");

group("working with properties", () => {

  lab.test("a mix of existing and non-existing source data works correctly", done => {

    const mapper = createMapper({ "experimental": true });

    const expected = {
      "space": {
        "useTypeName": "Office",
        "useTypeSector": "Business (B1a)",
        "useTypeCategory": "Office",
        "useTypeParentCategory": "Office"
      }
    };

    mapper
      .map("space.useType.name").to("space.useTypeName")
      .map("space.useType.sector").to("space.useTypeSector")
      .map("space.useType.category").to("space.useTypeCategory")
      .map("space.useType.parentCategory").to("space.useTypeParentCategory")
      .map("space.size").to("space.size"); // size is missing from source

    const result = mapper.execute({
      "space": {
        "useType": {
          "name": "Office",
          "sector": "Business (B1a)",
          "category": "Office",
          "parentCategory": "Office"
        }
      }
    });

    expect(result).to.equal(expected);

    return done();

  });

});
