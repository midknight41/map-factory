import { expect } from "code";
import getHelper from "lab-testing";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";

const suite = labSuite.create();

suite.expect("LABELS").to.be.an.array();
suite.expect("GET_ITEM").to.be.a.string();
suite.expect("SET_ITEM").to.be.a.string();
suite.expect("NO_SOURCE_EXPECTED").to.be.anything();
suite.expect("MODIFY_VALUE").to.be.anything();
suite.expect("MODIFIED_EXPECTED").to.be.anything();
suite.expect("EXPERIMENTAL").to.be.a.boolean();

suite.declare((lab, variables) => {

  const {
    LABELS,
    GET_ITEM,
    SET_ITEM,
    NO_SOURCE_EXPECTED,
    MODIFY_VALUE,
    MODIFIED_EXPECTED,
    EXPERIMENTAL
  } = variables;

  const testing = getHelper(lab);
  const group = testing.createExperiment(...LABELS);

  function createSut() {
    return createMapper({ experimental: EXPERIMENTAL });
  }

  // const experimentalLabel = EXPERIMENTAL === true ? "in experimental mode" : "in normal mode";

  group("when source does not exist", () => {

    // lab.experiment(experimentalLabel, () => {


    lab.test("the target field does not get created for a basic map", done => {

      const mapper = createSut();

      const actual = mapper
        .map(GET_ITEM).to(SET_ITEM)
        .execute({});

      expect(actual).to.equal(NO_SOURCE_EXPECTED);

      return done();

    });

    lab.test("the target field does not get created with a modifying transform", done => {

      const mapper = createSut();

      const actual = mapper
        .map(GET_ITEM).to(SET_ITEM, () => MODIFY_VALUE)
        .execute({});

      expect(actual).to.equal(NO_SOURCE_EXPECTED);

      return done();

    });

    lab.test("the target field does get created with a modifying transform with always flag", done => {

      const mapper = createSut();

      const actual = mapper
        .map(GET_ITEM).always.to(SET_ITEM, () => MODIFY_VALUE)
        .execute({});

      expect(actual).to.equal(MODIFIED_EXPECTED);

      return done();

    });

    lab.test("the target field does not get created for an array source with a pass-through transform", done => {

      const mapper = createSut();

      const actual = mapper
        .map([GET_ITEM]).to(SET_ITEM, value => value)
        .execute({});

      expect(actual).to.equal(NO_SOURCE_EXPECTED);

      return done();

    });

    lab.test("the target field does get created for an array source with a modifying transform with always flag", done => {

      const mapper = createSut();

      const actual = mapper
        .map([GET_ITEM]).always.to(SET_ITEM, () => MODIFY_VALUE)
        .execute({});

      expect(actual).to.equal(MODIFIED_EXPECTED);

      return done();

    });

    lab.test("the target field does not get created for an array source with a modifying transform", done => {

      const mapper = createSut();

      const actual = mapper
        .map([GET_ITEM]).to(SET_ITEM, () => MODIFY_VALUE)
        .execute({});

      expect(actual).to.equal(NO_SOURCE_EXPECTED);

      return done();

    });
  });
  // });
});

export default suite;
