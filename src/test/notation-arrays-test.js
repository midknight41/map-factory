import * as Lab from "lab";
import suite from "./suites/notation-suite";

const lab = exports.lab = Lab.script();

// Arrays Test
suite.run(lab, {
  LABEL: "deep array",
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
