import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory");

const createMapper = require("../lib/index");

group("working with arrays", () => {

  lab.test("a mix of existing and non-existing source data works correctly", done => {

    const mapper = createMapper({ "experimental": true });

    const expected = {
      "property":
      {
        "spaces": [{
          "useTypeName": "Office",
          "useTypeSector": "Business (B1a)",
          "useTypeCategory": "Office",
          "useTypeParentCategory": "Office"
        }]
      }

    };

    mapper
      .map("propertySpaces.[].useType.name").to("property.spaces.[].useTypeName")
      .map("propertySpaces.[].useType.sector").to("property.spaces.[].useTypeSector")
      .map("propertySpaces.[].useType.category").to("property.spaces.[].useTypeCategory")
      .map("propertySpaces.[].useType.parentCategory").to("property.spaces.[].useTypeParentCategory")
      .map("propertySpaces.[].size").to("property.spaces.[].size"); // size is missing from source

    const result = mapper.execute({
      "propertySpaces": [
        {
          "useType": {
            "name": "Office",
            "sector": "Business (B1a)",
            "category": "Office",
            "parentCategory": "Office"
          }
        }
      ]
    });

    expect(result).to.equal(expected);

    return done();

  });

});
