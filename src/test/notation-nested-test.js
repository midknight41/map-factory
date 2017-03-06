import * as Lab from "lab";
import suite from "./suites/notation-suite";

const lab = exports.lab = Lab.script();

suite.run(lab, {
  LABEL: "nested",
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
