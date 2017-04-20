import { expect } from "code";
import getHelper from "lab-testing";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";

const suite = labSuite.create();

suite.expect("LABELS").to.be.an.array();
suite.expect("GET_ITEM").to.be.a.string();
suite.expect("SET_ITEM").to.be.a.string();
suite.expect("SOURCE").to.be.an.object();
suite.expect("EXPECTED").to.be.anything();
suite.expect("EXPERIMENTAL").to.be.a.boolean();

suite.declare((lab, variables) => {

  const {
    LABELS,
    GET_ITEM,
    SET_ITEM,
    SOURCE,
    EXPECTED,
    EXPERIMENTAL
  } = variables;

  const testing = getHelper(lab);
  const group = testing.createExperiment(...LABELS);

  function createSut() {
    return createMapper({ experimental: EXPERIMENTAL });
  }

  const experimentalLabel = EXPERIMENTAL === true ? "in experimental mode" : "in normal mode";

  group("when the source exists", () => {

    lab.experiment(experimentalLabel, () => {

      lab.test("a string source can be selected and mapped to the target without a transform", done => {

        const mapper = createSut();

        const actual = mapper
          .map(GET_ITEM).to(SET_ITEM)
          .execute(SOURCE);

        expect(actual).to.equal(EXPECTED);

        return done();

      });

      lab.test("a string source can be selected and mapped to the target with a transform", done => {

        const mapper = createSut();

        const actual = mapper
          .map(GET_ITEM).to(SET_ITEM, value => value)
          .execute(SOURCE);

        expect(actual).to.equal(EXPECTED);

        return done();

      });

      lab.test("an array source can be selected and mapped to the target", done => {

        const mapper = createSut();

        const actual = mapper
          .map([GET_ITEM]).to(SET_ITEM, value => value)
          .execute(SOURCE);

        expect(actual).to.equal(EXPECTED);

        return done();

      });

    });

  });

});

export default suite;
