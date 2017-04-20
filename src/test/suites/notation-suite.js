import * as labSuite from "lab-suite";

import emptySourceSuite from "./empty-source-suite";
import mappingSuite from "./mapping-suite";

const suite = labSuite.create();

suite.expect("LABELS").to.be.an.array();
suite.expect("GET_ITEM").to.be.a.string();
suite.expect("SET_ITEM").to.be.a.string();
suite.expect("SOURCE").to.be.an.object();
suite.expect("EXPECTED").to.be.anything();
suite.expect("NO_SOURCE_EXPECTED").to.be.an.anything();
suite.expect("MODIFY_VALUE").to.be.anything();
suite.expect("MODIFIED_EXPECTED").to.be.an.anything();

suite.declare((lab, variables) => {

  // variables.EXPERIMENTAL = true;
  // mappingSuite.run(lab, variables);
  // emptySourceSuite.run(lab, variables);

  variables.EXPERIMENTAL = false;
  mappingSuite.run(lab, variables);
  emptySourceSuite.run(lab, variables);

});

export default suite;
