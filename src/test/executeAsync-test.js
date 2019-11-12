import * as Lab from "@hapi/lab";
import { expect, fail } from "@hapi/code";
import createMapper from "../lib";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();

const testing = getHelper(lab);
const group = testing.createExperiment("interfaces");

const source = {
  "foo": "bar",
  "bar": "foo"
};
const expected = {
  "foo": "bar"
};
let mapper;

group("The executeAsync() method", () => {

  lab.beforeEach(() => {
    mapper = createMapper();
  });

  lab.experiment("when execute async is called from the mapper instance", () => {

    lab.test("should return a resolved promise with the desired result", () => {
      mapper.map("foo");
      mapper.executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
        });
    });

    lab.test("should reject when an error is thrown", () => {
      mapper.map("foo");
      mapper.executeAsync(null)
        .then(() => {

          fail("unexpected success");
        })
        .catch(error => {
          expect(error).to.be.an.error();
        });
    });
  });

  lab.experiment("when execute async is called from the default function", () => {

    lab.test("should return a resolved promise with the desired result", () => {
      mapper
        .map("foo").to("bar")
        .executeAsync(source)
        .then(actual => {
          expect(actual).to.equal({ "bar": "bar" });
        });
    });
  });

  lab.experiment("when execute async is called from the chain", () => {

    lab.test("should return a resolved promise with the desired result", () => {
      mapper("foo").executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
        });
    });
  });
});
