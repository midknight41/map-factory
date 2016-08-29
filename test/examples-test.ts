import * as nodeunit from "nodeunit";
// tslint:disable-next-line:no-require-imports
const createMapper = require("../lib/index");


const exampleGroup: nodeunit.ITestGroup = {

  "Map a source field to the same object structure": function (test: nodeunit.Test): void {

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

    test.deepEqual(result, expected);

    return test.done();
  },

  "Map a source field to a different object structure": function (test: nodeunit.Test): void {

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

    test.deepEqual(result, expected);

    return test.done();
  },

  "Supports deep references for source and target objects": function (test: nodeunit.Test): void {

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
    map("account.entitlements.[].name").to("user.entitlements");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "You can also reference specific items in an array": function (test: nodeunit.Test): void {

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

    map("articles.[0]").to("topStory");

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },
  "provides the each() method to help work with arrays and multiple mappers": function (test: nodeunit.Test): void {
    const source = {
      one: [{value: "a", drop: "me" }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }],
      two: [{value: "a", drop: "me"  }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }],
      three: [{value: "a", drop: "me"  }, {value: "b", drop: "me"  }, {value: "c", drop: "me"  }]
    };

    const expected = {
      one: [{item: "a" }, {item: "b" }, {item: "c" }],
      two: [{item: "a" }, {item: "b" }, {item: "c" }],
      three: [{item: "a" }, {item: "b" }, {item: "c" }]
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

    test.deepEqual(actual, expected);

    return test.done();
  },
  "More complicated transformations can be handled by providing a function": function (test: nodeunit.Test): void {

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

    map("articles.[0]").to("topStory");
    map("articles").to("otherStories", articles => {

      // We don't want to include the top story
      articles.shift();

      return articles;

    });

    const result = map.execute(source);

    // End example

    test.deepEqual(result, expected);

    return test.done();
  },

  "An existing object can be provided as the target object": function (test: nodeunit.Test): void {

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

    test.deepEqual(result, expected);

    return test.done();
  },

  "Select from multiple sources at once": function (test: nodeunit.Test): void {

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

    test.deepEqual(result, expected);

    return test.done();
  },
  "create a single transform mapping object which is used to map all of your data together": function (test: nodeunit.Test) {

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

    test.deepEqual(final, expected);
    test.done();

  },
  "Or use multiple mappers and chain them together": function (test: nodeunit.Test) {


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

    test.deepEqual(result, expected);
    test.done();
  }

};

exports.examples = exampleGroup;
