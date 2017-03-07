/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable id-length */
/* eslint-disable comma-style */
/* eslint-disable camelcase */
/* eslint-disable dot-notation */
/* eslint-disable no-return-assign */

import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory", "object-mapper");

import om from "../../lib/object-mapper/object-mapper";

group("The objectMapper() method", () => {

  lab.test("map object to another - simple", done => {
    const obj = {
      "foo": "bar"
    };

    const expected = {
      "bar": "bar"
    };

    const map = {
      "foo": "bar"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - complexity 1", done => {
    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      bar: {
        foo: "baz"
      }
    };

    const map = {
      "foo.bar": "bar.foo"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - complexity 2", done => {
    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "foo.bar": "bar.foo[].baz"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with base object", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "foo.bar": "bar.foo[].baz"
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with two destinations for same value", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": "bar"
    };

    const expected = {
      test: 1,
      bar: "bar",
      baz: "bar"
    };

    const map = {
      "foo": ["bar", "baz"]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("map object to another - with two destinations for same value inside object", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: {
          baz: "baz",
          foo: "baz"
        }
      }
    };

    const map = {
      "foo.bar": ["bar.foo.baz", "bar.foo.foo"]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("map object to another - with two destinations for same value inside array", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz",
          foo: "baz"
        }]
      }
    };

    const map = {
      "foo.bar": ["bar.foo[].baz", "bar.foo[].foo"]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with three destinations for same value", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz",
          foo: "baz",
          bar: ["baz"]
        }]
      }
    };

    const map = {
      "foo.bar": ["bar.foo[].baz", "bar.foo[].foo", "bar.foo[].bar[]"]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key object notation", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "foo.bar": {
        key: "bar.foo[].baz"
      }
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key object notation with default value when key does not exists", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: 10
        }]
      }
    };

    const map = {
      "notExistingKey": {
        key: "bar.foo[].baz",
        "default": 10
      }
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key object notation with default function when key does not exists", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "notExistingKey": {
        key: "bar.foo[].baz",
        default: function (fromObject, fromKey, toObject, toKey) {
          return fromObject.foo.bar;
        }
      }
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - when target key is undefined it should be ignored", done => {
    const obj = {
      "a": 1234,
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      bar: {
        bar: "baz"
      }
    };

    const map = {
      "foo.bar": "bar.bar",
      "a": undefined
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key object notation with default function returning undefined when key does not exists", done => {
    const obj = {
      "a": 1234,
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      bar: {
        bar: "baz",
        a: 1234
      }
    };

    const map = {
      "foo.bar": "bar.bar",
      "notExistingKey": {
        key: "bar.test",
        default: function (fromObject, fromKey, toObject, toKey) {
          return undefined;
        }
      },
      "a": "bar.a"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key object notation with transform", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz-foo"
        }]
      }
    };

    const map = {
      "foo.bar": {
        key: "bar.foo[].baz",
        transform: function (value, fromObject, toObject, fromKey, toKey) {
          return value + "-foo";
        }
      }
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });


  lab.test("map object to another - with two destinations for same value one string and one object", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz",
          foo: "baz-foo"
        }]
      }
    };

    const map = {
      "foo.bar": ["bar.foo[].baz", {
        key: "bar.foo[].foo",
        transform: function (value, fromObject, toObject, fromKey, toKey) {
          return value + "-foo";
        }
      }]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key array notation", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "foo.bar": [["bar.foo[].baz"]]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("map object to another - with key array notation with default value when key does not exists", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: 10
        }]
      }
    };

    const map = {
      "notExistingKey": [["bar.foo[].baz", null, 10]]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key array notation with default function when key does not exists", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz"
        }]
      }
    };

    const map = {
      "notExistingKey": [["bar.foo[].baz", null, function (fromObject, fromKey, toObject, toKey) {
        return fromObject.foo.bar;
      }]]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - with key array notation with transform function", done => {
    const baseObject = {
      test: 1
    };

    const obj = {
      "foo": {
        "bar": "baz"
      }
    };

    const expected = {
      test: 1,
      bar: {
        foo: [{
          baz: "baz-foo"
        }]
      }
    };

    const map = {
      "foo.bar": [["bar.foo[].baz", function (value, fromObject, toObject, fromKey, toKey) {
        return value + "-foo";
      }]]
    };

    const result = om(obj, baseObject, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - map object without destination key via transform", done => {
    const obj = {
      thing: {
        thing2: {
          thing3: {
            a: "a1",
            b: "b1"
          }
        }
      }
    };

    const map = {
      "thing.thing2.thing3": [[null, function (val, src, dst) {
        dst.manual = val.a + val.b;
      },
        null]]
    };

    const expected = {
      "manual": "a1b1"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - simple", done => {
    const obj = {
      "comments": [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
      ]
    };

    const map = {
      "comments[].a": ["comments[].c"], "comments[].b": ["comments[].d"]
    };

    const expected = {
      "comments": [
        { c: "a1", d: "b1" },
        { c: "a2", d: "b2" }
      ]
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - two level deep", done => {
    const obj = {
      "comments": [
        {
          "data": [
            { a: "a1", b: "b1" },
            { a: "a2", b: "b2" }
          ]
        }
      ]
    };

    const map = {
      "comments[].data[].a": "comments[].data[].c",
      "comments[].data[].b": "comments[].data[].d"
    };

    const expected = {
      "comments": [
        {
          "data": [
            { c: "a1", d: "b1" }
            , { c: "a2", d: "b2" }
          ]
        }
      ]
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - simple deep", done => {
    const obj = {
      "thing": {
        "comments": [
          { a: "a1", b: "b1" }
          , { a: "a2", b: "b2" }
        ]
      }
    };

    const map = {
      "thing.comments[].a": ["thing.comments[].c"]
      , "thing.comments[].b": ["thing.comments[].d"]
    };

    const expected = {
      "thing": {
        "comments": [
          { c: "a1", d: "b1" }
          , { c: "a2", d: "b2" }
        ]
      }
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - from/to specific indexes", done => {
    const obj = {
      "comments": [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
      ]
    };

    const map = {
      "comments[0].a": ["comments[1].c"]
      , "comments[0].b": ["comments[1].d"]
    };

    const expected = {
      "comments": [
        , { c: "a1", d: "b1" }
      ]
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - fromObject is an array", done => {
    const obj = [
      { a: "a1", b: "b1" }
      , { a: "a2", b: "b2" }
    ];

    const map = {
      "[].a": "[].c"
      , "[].b": "[].d"
    };

    const expected = [
      { c: "a1", d: "b1" }
      , { c: "a2", d: "b2" }
    ];

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("array mapping - fromObject empty array property ignored", done => {
    const obj = {
      phone_numbers: []
    };

    const map = {
      "phone_numbers": {
        key: "questionnaire.initial.cellPhoneNumber",
        transform: function (sourceValue) {
          let i;

          if (!Array.isArray(sourceValue)) {
            return null;
          }

          for (i = 0; i < sourceValue.length; i++) {
            if (sourceValue[i].primary) {
              return {
                code: sourceValue[i].country_code,
                phone: sourceValue[i].number
              };
            }
          }
        }
      }
    };

    const target = {
      questionnaire: {
        initial: {}
      }
    };

    const expected = {
      questionnaire: {
        initial: {}
      }
    };

    const result = om(obj, target, map);

    expect(result).to.equal(expected);
    return done();


  });

  lab.test("mapping - map full array to single value via transform", done => {
    const obj = {
      thing: [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
        , { a: "a3", b: "b3" }
      ]
    };

    const map = {
      "thing": [["thing2", function (val, src, dst) {
        const a = val.reduce(function (i, inner) {
          return i += inner.a;
        }, "");

        return a;
      }
        , null]]
    };

    const expected = {
      "thing2": "a1a2a3"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("mapping - map full array without destination key via transform", done => {
    const obj = {
      thing: {
        thing2: {
          thing3: [
            { a: "a1", b: "b1" }
            , { a: "a2", b: "b2" }
            , { a: "a3", b: "b3" }
          ]
        }
      }
    };

    const map = {
      "thing.thing2.thing3": [[null, function (val, src, dst) {
        const a = val.reduce(function (i, inner) {
          return i += inner.a;
        }, "");

        dst.manual = a;
      }
        , null]]
    };

    const expected = {
      "manual": "a1a2a3"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("mapping - map full array to same array on destination side", done => {
    const obj = {
      thing: [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
        , { a: "a3", b: "b3" }
      ]
    };

    const map = {
      "thing": "thing2"
    };

    const expected = {
      "thing2": [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
        , { a: "a3", b: "b3" }
      ]
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("mapping - map and append full array to existing mapped array", done => {
    const obj = {
      thing: [
        { a: "a1", b: "b1" }
        , { a: "a2", b: "b2" }
        , { a: "a3", b: "b3" }
      ],
      thingOther: [{ a: "a4", b: "b4" }
        , { a: "a5", b: "b5" }
        , { a: "a6", b: "b6" }]
    };

    const map = {
      "thing": "thing2[]+",
      "thingOther": "thing2[]+"
    };

    const expected = {
      "thing2": [
        [{ a: "a1", b: "b1" }
          , { a: "a2", b: "b2" }
          , { a: "a3", b: "b3" }],
        [{ a: "a4", b: "b4" }
          , { a: "a5", b: "b5" }
          , { a: "a6", b: "b6" }]
      ]
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - prevent null values from being mapped", done => {
    const obj = {
      "a": 1234,
      "foo": {
        "bar": null
      }
    };

    const expected = {
      foo: {
        a: 1234
      },
      bar: {

      }
    };

    const map = {
      "foo.bar": "bar.bar",
      "a": "foo.a"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - allow null values", done => {
    const obj = {
      "a": 1234,
      "foo": {
        "bar": null
      }
    };

    const expected = {
      foo: {
        a: 1234
      },
      bar: null
    };

    const map = {
      "foo.bar": "bar?",
      "a": "foo.a"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("map object to another - allow null values", done => {
    const obj = {
      "a": 1234,
      "foo": {
        "bar": null
      }
    };

    const expected = {
      foo: {
        a: 1234
      },
      bar: {
        bar: null
      }
    };

    const map = {
      "foo.bar": "bar.bar?",
      "a": "foo.a"
    };

    const result = om(obj, map);

    expect(result).to.equal(expected);
    return done();
  });


  lab.test("original constious tests", done => {
    const merge = om.merge;

    const obj = {
      "sku": "12345"
      , "upc": "99999912345X"
      , "title": "Test Item"
      , "descriptions": ["Short description", "Long description"]
      , "length": 5
      , "width": 2
      , "height": 8
      , "inventory": {
        "onHandQty": 0
        , "replenishQty": null
      }
      , "price": 100
    };

    const map = {
      "sku": "Envelope.Request.Item.SKU"
      , "upc": "Envelope.Request.Item.UPC"
      , "title": "Envelope.Request.Item.ShortTitle"
      , "length": "Envelope.Request.Item.Dimensions.Length"
      , "width": "Envelope.Request.Item.Dimensions.Width"
      , "height": "Envelope.Request.Item.Dimensions.Height"
      , "weight": [["Envelope.Request.Item.Weight", null, function () {
        return 10;
      }]]
      , "weightUnits": [["Envelope.Request.Item.WeightUnits", null, function () {
        return null;
      }]]
      , "inventory.onHandQty": "Envelope.Request.Item.Inventory?"
      , "inventory.replenishQty": "Envelope.Request.Item.RelpenishQuantity?"
      , "inventory.isInventoryItem": { key: ["Envelope.Request.Item.OnInventory", null, "YES"] }
      , "price": ["Envelope.Request.Item.Price[].List", "Envelope.Request.Item.Price[].Value", "Test[]"]
      , "descriptions[0]": "Envelope.Request.Item.ShortDescription"
      , "descriptions[1]": "Envelope.Request.Item.LongDescription"
    };

    const expected = {
      Test: [100],
      Envelope: {
        Request: {
          Item: {
            SKU: "12345",
            UPC: "99999912345X",
            ShortTitle: "Test Item",
            Dimensions: {
              Length: 5,
              Width: 2,
              Height: 8
            },
            Weight: 10,
            Inventory: 0,
            RelpenishQuantity: null,
            OnInventory: "YES",
            Price: [{
              List: 100,
              Value: 100
            }],
            ShortDescription: "Short description",
            LongDescription: "Long description"
          }
        }
      }
    };

    let result = merge(obj, {}, map);

    expect(result).to.equal(expected);

    map.sku = {
      key: "Envelope.Request.Item.SKU"
      , transform: function (val, objFrom, objTo) {
        return "over-ridden-sku";
      }
    };

    expected.Envelope.Request.Item.SKU = "over-ridden-sku";

    result = merge(obj, {}, map);

    expect(result, "override sku").to.equal(expected);

    obj["inventory"] = null;
    expected.Envelope.Request.Item.Inventory = null;

    result = merge(obj, {}, map);

    expect(result, "null inventory").to.equal(expected);

    return done();
  });

});
