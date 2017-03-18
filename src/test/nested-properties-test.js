import * as Lab from "lab";
import suite from "./suites/notation-suite";
import manyMappings from "./suites/many-mappings-suite";

const lab = exports.lab = Lab.script();

suite.run(lab, {
  LABELS: ["properties", "nested"],
  GET_ITEM: "field.fieldName",
  SET_ITEM: "field.name",
  SOURCE: {
    field: {
      fieldName: "my name"
    }
  },
  EXPECTED: {
    field:
    {
      name: "my name"
    }
  },
  NO_SOURCE_EXPECTED: {
    field: {}
  },
  MODIFY_VALUE: "modified",
  MODIFIED_EXPECTED: {
    field: {
      name: "modified"
    }
  }

});

// The source does not contain all the required data
const labels = ["properties", "nested", "mix of available and missing data"];
const mappings = [
  { from: "propertySpaces.parentCategory", to: "property.category" },
  { from: "propertySpaces.size", to: "property.size" }
];
const source = {
  "propertySpaces":
  {
    "parentCategory": "Office"
  }

};
const expected = {
  "property":
  {
    "category": "Office"
  }
};

manyMappings.run(lab, {
  LABELS: labels,
  MAPPINGS: mappings,
  SOURCE: source,
  EXPECTED: expected,
  EXPERIMENTAL: true
});

manyMappings.run(lab, {
  LABELS: labels,
  MAPPINGS: mappings,
  SOURCE: source,
  EXPECTED: expected,
  EXPERIMENTAL: false
});
