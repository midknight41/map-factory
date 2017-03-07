import { expect } from "code";
import getHelper from "lab-testing";
import * as labSuite from "lab-suite";

import createMapper from "../../lib/map-factory";

const suite = labSuite.create();

suite.expect("LABEL").to.be.a.string();
suite.expect("GET_ITEM").to.be.a.string();
suite.expect("SET_ITEM").to.be.a.string();
suite.expect("SOURCE").to.be.an.object();
suite.expect("EXPECTED").to.be.an.object();
suite.expect("NO_SOURCE_EXPECTED").to.be.an.object();
suite.expect("MODIFY_VALUE").to.be.anything();
suite.expect("MODIFIED_EXPECTED").to.be.an.object();

suite.declare((lab, variables) => {

  const testing = getHelper(lab);
  const group = testing.createExperiment("map-factory", "notation");

  function createSut() {
    return createMapper({ experimental: true });
  }

  const {
    LABEL,
    GET_ITEM,
    SET_ITEM,
    SOURCE,
    EXPECTED,
    NO_SOURCE_EXPECTED,
    MODIFY_VALUE,
    MODIFIED_EXPECTED
  } = variables;

  group(`${LABEL}: when the source exists`, () => {

    lab.test("can be selected and mapped to the target", done => {

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

  group(`${LABEL}: when source does not exist`, () => {

    lab.test("the target field does not get created for a basic map", done => {

      const mapper = createSut();

      const actual = mapper
        .map(GET_ITEM).to(SET_ITEM)
        .execute({});

      expect(actual).to.equal(NO_SOURCE_EXPECTED);

      return done();

    });

    lab.test("the target field does get created with a modifying transform", done => {

      const mapper = createSut();

      const actual = mapper
        .map(GET_ITEM).to(SET_ITEM, () => MODIFY_VALUE)
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

    lab.test("the target field does get created for an array source with a modifying transform", done => {

      const mapper = createSut();

      const actual = mapper
        .map([GET_ITEM]).to(SET_ITEM, () => MODIFY_VALUE)
        .execute({});

      expect(actual).to.equal(MODIFIED_EXPECTED);

      return done();

    });
  });
});

export default suite;
