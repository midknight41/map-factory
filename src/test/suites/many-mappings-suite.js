import { expect } from "code";
import getHelper from "lab-testing";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";

const suite = labSuite.create();

suite.expect("LABELS").to.be.an.array();
suite.expect("MAPPINGS").to.be.an.array();
suite.expect("SOURCE").to.be.an.object().or.an.array();
suite.expect("EXPECTED").to.be.an.object().or.an.array();
// suite.expect("EXPERIMENTAL").to.be.a.boolean();

suite.declare((lab, variables) => {

  const {
    LABELS,
    MAPPINGS,
    SOURCE,
    EXPECTED,
    EXPERIMENTAL
  } = variables;

  const testing = getHelper(lab);
  const group = testing.createExperiment(...LABELS);

  function createSut() {
    return createMapper({ experimental: EXPERIMENTAL });
  }

  // const experimentalLabel = EXPERIMENTAL === true ? "in experimental mode" : "in normal mode";

  group("when the source exists", () => {

    // lab.experiment(experimentalLabel, () => {

    lab.test("source values can be mapped to the target without a transform", done => {

      const map = createSut();

      for (const item of MAPPINGS) {
        map(item.from).to(item.to);
      }

      const actual = map.execute(SOURCE);

      expect(actual).to.equal(EXPECTED);

      return done();

    });

    lab.test("source values can be mapped to the target with a transform", done => {

      const map = createSut();

      for (const item of MAPPINGS) {
        map(item.from).to(item.to, value => value);
      }

      const actual = map.execute(SOURCE);
      expect(actual).to.equal(EXPECTED);

      return done();

    });

    lab.test("source values can be mapped to the target in multi-mode", done => {

      const map = createSut();

      for (const item of MAPPINGS) {
        map([item.from]).to(item.to, value => value);
      }

      const actual = map.execute(SOURCE);

      expect(actual).to.equal(EXPECTED);


      return done();

    });

  });

});

export default suite;
