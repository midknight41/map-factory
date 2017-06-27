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

describe("Execute Async functionality of the mapper", function () {

  beforeEach(function (done) {
    mapper = createMapper();
    done();
  });

  describe("when execute async is called from the mapper instance", function () {

    it("should return a resolved promise with the desired result", function (done) {
      mapper.map("foo");
      mapper.executeAsync(source)
        .then(function (actual) {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });

  describe("when execute async is called from the default function", function () {

    it("should return a resolved promise with the desired result", function (done) {
      mapper("foo");
      mapper.executeAsync(source)
        .then(function (actual) {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });

  describe("when execute async is called from the chain", function () {

    it("should return a resolved promise with the desired result", function (done) {
      mapper("foo").executeAsync(source)
        .then(function (actual) {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });
});