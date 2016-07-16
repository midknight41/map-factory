import * as nodeunit from "nodeunit";
const createMapper = require("../lib/index");

const exampleGroup: nodeunit.ITestGroup = {

  "Map a source field to the same object structure": function (test: nodeunit.Test): void {

    const expected = {
      "fieldName": "name1",
      "fieldId": "123"
    }

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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
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
    console.log(result);

    // End example

    test.deepEqual(result, expected);
    test.done();
  }
}

exports.examples = exampleGroup;
