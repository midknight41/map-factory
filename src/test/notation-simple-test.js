import * as Lab from "lab";
import suite from "./suites/notation-suite";

const lab = exports.lab = Lab.script();

suite.run(lab, {
  LABEL: "simple",
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
