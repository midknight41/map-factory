import * as Lab from "lab";
import { expect, fail } from "code";
import createMapper from "../lib";

const { describe, it, beforeEach } = exports.lab = Lab.script();
const source = {
  "foo": "bar",
  "bar": "foo"
};
const expected = {
  "bar": "bar"
};
let mapper;
let secondaryMapper;

describe("Chain functionality of the mapper", () => {

  beforeEach(done => {
    mapper = createMapper();
    secondaryMapper = createMapper();
    done();
  });

  describe("when chain is called from the mapper instance", () => {

    it("should return response with the desired result", done => {
      mapper.map("foo");
      secondaryMapper.map("foo").to("bar");
      expect(mapper.chain(secondaryMapper).execute(source)).to.equal(expected);
      done();
    });
  });

  describe("when chain is called from the default function", () => {

    it("should return response with the desired result", done => {
      secondaryMapper.map("foo").to("bar");
      const actual = mapper
        .map("foo")
        .chain(secondaryMapper)
        .execute(source);

      expect(actual).to.equal(expected);
      done();
    });
  });

  describe("when chain is called", () => {

    it("should return a response with the desired result", done => {
      secondaryMapper.map("foo").to("bar");
      const actual = mapper("foo").chain(secondaryMapper).execute(source);
      expect(actual).to.equal(expected);
      done();
    });
  });
});
