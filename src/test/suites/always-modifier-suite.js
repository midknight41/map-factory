import { expect } from "code";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";

const suite = labSuite.create();

suite.expect("OPTIONS").to.be.an.anything();

suite.declare((lab, variables) => {

  const {
    OPTIONS
  } = variables;

  lab.test(`overrides the default alwaysTransform behaviour with options ${JSON.stringify(OPTIONS)}`, done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
    };

    const map = createMapper(OPTIONS);

    map("my.source.is.missing").existing.to("your.source.is.missing", () => {
      return "failed";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });


});

export default suite;
