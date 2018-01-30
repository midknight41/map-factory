import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import assert from "assert";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory");

const createMapper = require("../lib/index");
const { getValue, setValue } = createMapper;

group("examples", () => {

  lab.test("Map a source field to the same object structure", done => {

    const expected = {
      "fieldName": "name1",
      "fieldId": "123"
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const map = createMapper();

    map("fieldName");
    map("fieldId");

    const result = map.execute(source);

    // End example


    expect(result).to.equal(expected);

    return done();
  });

  lab.test("Map a source field to a different object structure", done => {

    const expected = {
      "field": {
        "name": "name1",
        "id": "123"
      }
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const map = createMapper();

    map("fieldName").to("field.name");
    map("fieldId").to("field.id");

    const result = map.execute(source);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("Supports deep references for source and target objects", done => {

    const expected = {
      user:
      {
        login: "john@someplace.com",
        accountId: "abc123",
        entitlements: ["game-1", "game-2"]
      }
    };

    // Start example

    const source = {
      "person": {
        "name": "John",
        "email": "john@someplace.com",
        "phone": "(712) 123 4567"
      },
      "account": {
        "id": "abc123",
        "entitlements": [{
          "id": 1,
          "name": "game-1"
        },
        {
          "id": 2,
          "name": "game-2"
        }]
      }
    };

    const map = createMapper();

    map("person.email").to("user.login");
    map("account.id").to("user.accountId");
    map("account.entitlements[].name").to("user.entitlements");

    const result = map.execute(source);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("You can also reference specific items in an array", done => {

    const expected = {
      "topStory": {
        "id": 1,
        "title": "Top Article",
        "author": "Joe Doe",
        "body": "..."
      }
    };

    // Start example

    const source = {
      "articles": [
        {
          "id": 1,
          "title": "Top Article",
          "author": "Joe Doe",
          "body": "..."
        },
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    const map = createMapper();

    map("articles[0]").to("topStory");

    const result = map.execute(source);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("provides the each() method to help work with arrays and multiple mappers", done => {
    const source = {
      one: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }],
      two: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }],
      three: [{ value: "a", drop: "me" }, { value: "b", drop: "me" }, { value: "c", drop: "me" }]
    };

    const expected = {
      one: [{ item: "a" }, { item: "b" }, { item: "c" }],
      two: [{ item: "a" }, { item: "b" }, { item: "c" }],
      three: [{ item: "a" }, { item: "b" }, { item: "c" }]
    };

    const mainMapper = createMapper();
    const childMapper = createMapper();

    childMapper
    .map("value").to("item");

    mainMapper
    .map("one").to("one", array => childMapper.each(array))
    .map("two").to("two", array => childMapper.each(array))
    .map("three").to("three", array => childMapper.each(array));

    const actual = mainMapper.execute(source);

    expect(actual).to.equal(expected);

    return done();
  });

  lab.test("More complicated transformations can be handled by providing a function", done => {

    const expected = {
      "topStory": {
        "id": 1,
        "title": "Top Article",
        "author": "Joe Doe",
        "body": "..."
      },
      "otherStories": [
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    // Start example

    const source = {
      "articles": [
        {
          "id": 1,
          "title": "Top Article",
          "author": "Joe Doe",
          "body": "..."
        },
        {
          "id": 2,
          "title": "Second Article",
          "author": "Joe Doe",
          "body": "..."
        }
      ]
    };

    const map = createMapper();

    map("articles[0]").to("topStory");
    map("articles").to("otherStories", articles => {

      // We don't want to include the top story
      articles.shift();

      return articles;

    });

    const result = map.execute(source);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("An existing object can be provided as the target object", done => {

    const expected = {
      "field": {
        "name": "name1",
        "id": "123"
      },
      "existing": "data"
    };

    // Start example

    const source = {
      "fieldName": "name1",
      "fieldId": "123",
      "fieldDescription": "description"
    };

    const destination = {
      "existing": "data"
    };

    const map = createMapper();

    map("fieldName").to("field.name");
    map("fieldId").to("field.id");

    const result = map.execute(source, destination);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("Select from multiple sources at once", done => {

    const expected = {
      "fruit": {
        "count": 7
      }
    };

    // Start example

    const source = {
      "apples": {
        "count": 3
      },
      "oranges": {
        "count": 4
      }
    };

    const map = createMapper();

    map(["apples.count", "oranges.count"]).to("fruit.count", (appleCount, orangeCount) => {

      return appleCount + orangeCount;

    });

    const result = map.execute(source);

    // End example

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("Create a single transform mapping object which is used to map all of your data together", done => {

    const expected = {
      "blog": {
        "post": {
          "text": "<p>Some Text</p>",
          "comments": ["not too bad", "pretty good", "awful"],
          "topComment": "not too bad"
        },
        "author": {
          "id": 123,
          "name": "John Doe",
          "email": "john.doe@nobody.com"
        }
      }
    };

    // Start example

    // assume the following inputs
    const post = {
      "body": "<p>Some Text</p>"
    };

    const comments = {
      "list": ["not too bad", "pretty good", "awful"]
    };

    const user = {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    };

    // combine multiple objects into a single source object
    const source = { post, comments, user };

    const map = createMapper();

    map("post.body").to("blog.post.text");
    map("comments.list").to("blog.post.comments");
    map("comments.list[0]").to("blog.post.topComment");
    map("user.id").to("blog.author.id");
    map("user.name").to("blog.author.name");
    map("user.email").to("blog.author.email");

    const final = map.execute(source);

    // End example

    expect(final).to.equal(expected);
    return done();

  });

  lab.test("Or use multiple mappers and chain them together", done => {
    const expected = {
      "blog": {
        "post": {
          "text": "<p>Some Text</p>",
          "comments": ["not too bad", "pretty good", "awful"],
          "topComment": "not too bad"
        },
        "author": {
          "id": 123,
          "name": "John Doe",
          "email": "john.doe@nobody.com"
        }
      }
    };

    // Start Example

    // assume the following inputs
    const post = {
      "body": "<p>Some Text</p>"
    };

    const comments = {
      "list": ["not too bad", "pretty good", "awful"]
    };

    const user = {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@nobody.com"
    };

    const postMapper = createMapper();
    const commentMapper = createMapper();
    const authorMapper = createMapper();

    postMapper
      .map("body").to("blog.post.text");

    commentMapper
      .map("list").to("blog.post.comments")
      .map("list[0]").to("blog.post.topComment");

    authorMapper
      .map("id").to("blog.author.id")
      .map("name").to("blog.author.name")
      .map("email").to("blog.author.email");

    let result = postMapper.execute(post);
    result = commentMapper.execute(comments, result);
    result = authorMapper.execute(user, result);

    // End example

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("The or() method example", done => {

    const source = {
      "leasee": "Mr. Man"
    };

    const expected = {
      "occupier": "Mr. Man"
    };

    const map = createMapper();

    map("occupier").or("leasee").or("tenant").to("occupier");

    const result = map.execute(source);

    expect(result).to.equal(expected);

    return done();
  });

  lab.test("getValue example", done => {

    //    const { getValue, setValue } = require("map-factory");

    const obj = {
      my: {
        deep: {
          value: "here"
        }
      }
    };

    const value = getValue(obj, "my.deep.value");
    expect(value).to.equal("here");


    return done();

  });

  lab.test("setValue example", done => {

    const expected = {
      my: {
        example: {
          set: "done"
        }
      }
    };

    const actual = setValue({}, "my.example.set", "done");
    expect(actual).to.equal(expected);

    return done();

  });

});

group("example - cheatsheet", () => {

  lab.test("cheatsheet", done => {

    const source = {
      my: {
        deep: {
          object: { name: "john" },
          value: "abc",
          array: [
            { value: 1 },
            { value: 2 },
            { value: 3 }
          ]
        },
        other: {
          array: [4, 5, 6]
        }
      }
    };

    const mapper = createMapper();

    mapper
      .map("my.deep.value").to("example.basic.value")
      .map("my.deep.object").to("example.basic.object")
      .map("my.deep.array[0]").to("example.arrays.first")
      .map("my.deep.array").to("example.arrays.items")
      .map("my.deep.array[].value").to("example.arrays.values")
      .map("my.other.array").to("example.arrays.valueArray");

    const actual = mapper.execute(source);

    const expected = {
      example: {
        basic: {
          value: "abc",
          object: { name: "john" }
        },
        arrays: {
          first: { value: 1 },
          items: [
            { value: 1 },
            { value: 2 },
            { value: 3 }
          ],
          values: [1, 2, 3],
          valueArray: [4, 5, 6]
        }
      }
    };

    assert.deepEqual(actual, expected);

    return done();

  });

});
