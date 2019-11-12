import * as Lab from "@hapi/lab";
import { expect } from "@hapi/code";
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

  beforeEach(() => {
    mapper = createMapper();
    secondaryMapper = createMapper();
  });

  describe("when chain is called from the mapper instance", () => {

    it("should return response with the desired result", () => {
      mapper.map("foo");
      secondaryMapper.map("foo").to("bar");
      expect(mapper.chain(secondaryMapper).execute(source)).to.equal(expected);
    });
  });

  describe("when chain is called from the default function", () => {

    it("should return a response with the desired result", () => {
      secondaryMapper.map("foo").to("bar");
      const actual = mapper("foo").chain(secondaryMapper).execute(source);
      expect(actual).to.equal(expected);
    });
  });

  describe("when chain is called without any params", () => {

    it("should throw an error", () => {
      expect(() => mapper
        .map("foo")
        .chain()
        .execute(source)).to.throw("mapper passed in chain can neither be null or undefined");
    });
  });

});
