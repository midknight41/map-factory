import * as Lab from "lab";
import { expect, fail } from "code";
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

  lab.beforeEach(done => {
    mapper = createMapper();
    done();
  });

  lab.experiment("when execute async is called from the mapper instance", () => {

    lab.test("should return a resolved promise with the desired result", done => {
      mapper.map("foo");
      mapper.executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
          done();
        });
    });

    lab.test("should reject when an error is thrown", done => {
      mapper.map("foo");
      mapper.executeAsync(null)
        .then(() => {

          fail("unexpected success");
        })
        .catch(error => {
          expect(error).to.be.an.error();
          return done();
        });
    });


  });

  lab.experiment("when execute async is called from the default function", () => {

    lab.test("should return a resolved promise with the desired result", done => {
      mapper
        .map("foo").to("bar")
        .executeAsync(source)
        .then(actual => {
          expect(actual).to.equal({ "bar": "bar" });
          done();
        });
    });
  });

  lab.experiment("when execute async is called from the chain", () => {

    lab.test("should return a resolved promise with the desired result", done => {
      mapper("foo").executeAsync(source)
        .then(actual => {
          expect(actual).to.equal(expected);
          done();
        });
    });
  });
});
