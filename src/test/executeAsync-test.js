import * as Lab from "lab";
import {expect} from "code";
import createMapper from "../lib";

const {describe, it, beforeEach} = exports.lab = Lab.script();
const source = {
  "foo": "bar",
  "bar": "foo"
};
const expected = {
  "foo": "bar"
};
let mapper;

describe("Execute Async functionality of the mapper", () => {

  beforeEach(done => {
    mapper = createMapper();
    done();
  });

  describe("when execute async is called from the mapper instance", () => {

    it("should return a resolved promise with the desired result", done => {
      mapper.map("foo");
      mapper.executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });

  describe("when execute async is called from the default function", () => {

    it("should return a resolved promise with the desired result", done => {
      mapper
        .map("foo").to("bar")
        .executeAsync(source)
        .then(actual => {
          expect(actual).to.equal({"bar": "bar"});
          done();
        });
    });
  });

  describe("when execute async is called from the chain", () => {

    it("should return a resolved promise with the desired result", done => {
      mapper("foo").executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });
});