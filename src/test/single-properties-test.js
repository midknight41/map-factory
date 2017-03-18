import * as Lab from "lab";
import suite from "./suites/notation-suite";
import manyMappings from "./suites/many-mappings-suite";

const lab = exports.lab = Lab.script();

suite.run(lab, {
  LABELS: ["properties", "simple"],
  GET_ITEM: "fieldName",
  SET_ITEM: "name",
  SOURCE: {
    fieldName: "my name"
  },
  EXPECTED: {
    name: "my name"
  },
  NO_SOURCE_EXPECTED: {},
  MODIFY_VALUE: "modified",
  MODIFIED_EXPECTED: {
    name: "modified"
  }
});

// The source does not contain all the required data
const labels = ["properties", "simple", "mix of available and missing data"];
const mappings = [
  { from: "propertyCategory", to: "category" },
  { from: "propertySize", to: "size" }
];
const source = {
  "propertyCategory": "Office"
};
const expected = {
  "category": "Office"
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
