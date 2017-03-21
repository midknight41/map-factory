import * as Lab from "lab";
import notationSuite from "./suites/notation-suite";
import manyMappings from "./suites/many-mappings-suite";

const lab = exports.lab = Lab.script();

notationSuite.run(lab, {
  LABELS: ["arrays", "single mapping array"],
  GET_ITEM: "array.[].id",
  SET_ITEM: "array.levels.[].id",
  SOURCE: {
    array: [{ id: 1 }, { id: 2 }, { id: 3 }]
  },
  EXPECTED: {
    array: {
      levels: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  },
  NO_SOURCE_EXPECTED: {
    array: {
      levels: []
    }
  },
  MODIFY_VALUE: "modified",
  MODIFIED_EXPECTED: {
    array: {
      levels: [{ id: "modified" }]
    }
  }
});

// size is missing from source
const labels = ["arrays", "mix of available and missing data"];
const mappings = [
  { from: "propertySpaces.[].useType.parentCategory", to: "property.spaces.[].useTypeParentCategory" },
  { from: "propertySpaces.[].size", to: "property.spaces.[].size" }
];
const expected = {
  "property":
  {
    "spaces": [{
      "useTypeParentCategory": "Office"
    }]
  }
};
const source = {
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
