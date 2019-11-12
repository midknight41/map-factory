import * as Lab from "@hapi/lab";
import notationSuite from "./suites/notation-suite";
import manyMappings from "./suites/many-mappings-suite";

const lab = exports.lab = Lab.script();

notationSuite.run(lab, {
  LABELS: ["arrays", "value arrays", "single mapping array specifying index"],
  GET_ITEM: "item",
  SET_ITEM: "[0]",
  SOURCE: {
    item: 123
  },
  EXPECTED: [123],
  NO_SOURCE_EXPECTED: [],
  MODIFY_VALUE: "modified",
  MODIFIED_EXPECTED: ["modified"]
});

notationSuite.run(lab, {
  LABELS: ["arrays", "value arrays", "single mapping array"],
  GET_ITEM: "item",
  SET_ITEM: "[]",
  SOURCE: {
    item: 123
  },
  EXPECTED: [123],
  NO_SOURCE_EXPECTED: [],
  MODIFY_VALUE: "modified",
  MODIFIED_EXPECTED: ["modified"]
});


// size is missing from source
const labels = ["arrays", "value arrays", "mix of available and missing data"];
const mappings = [
  { from: "group.colours.[]", to: "item.signals" },
  { from: "group.name", to: "item.name" }
];
const source = {
  "group": {
    "colours": ["red", "yellow", "green"]
  }
};

const expected = {
  "item": {
    "signals": ["red", "yellow", "green"]
  }
};

// manyMappings.run(lab, {
//   LABELS: labels,
//   MAPPINGS: mappings,
//   SOURCE: source,
//   EXPECTED: expected,
//   EXPERIMENTAL: true
// });

manyMappings.run(lab, {
  LABELS: labels,
  MAPPINGS: mappings,
  SOURCE: source,
  EXPECTED: expected,
  EXPERIMENTAL: false
});
