"use strict";
var createMapper = require("../lib/index");
var exampleGroup = {
    "Map a source field to the same object structure": function (test) {
        var expected = {
            "fieldName": "name1",
            "fieldId": "123"
        };
        // Start example
        var source = {
            "fieldName": "name1",
            "fieldId": "123",
            "fieldDescription": "description"
        };
        var map = createMapper(source);
        map("fieldName");
        map("fieldId");
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    },
    "Map a source field to a different object structure": function (test) {
        var expected = {
            "field": {
                "name": "name1",
                "id": "123"
            }
        };
        // Start example
        var source = {
            "fieldName": "name1",
            "fieldId": "123",
            "fieldDescription": "description"
        };
        var map = createMapper(source);
        map("fieldName").to("field.name");
        map("fieldId").to("field.id");
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    },
    "Supports deep references for source and target objects": function (test) {
        var expected = {
            user: {
                login: "john@someplace.com",
                accountId: "abc123",
                entitlements: ["game-1", "game-2"]
            }
        };
        // Start example
        var source = {
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
        var map = createMapper(source);
        map("person.email").to("user.login");
        map("account.id").to("user.accountId");
        map("account.entitlements.[].name").to("user.entitlements");
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    },
    "Supports deep references for source and target objects - 2": function (test) {
        var expected = {
            "topStory": {
                "id": 1,
                "title": "Top Article",
                "author": "Joe Doe",
                "body": "..."
            }
        };
        // Start example
        var source = {
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
        var map = createMapper(source);
        map("articles.[0]").to("topStory");
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    },
    "Supports deep references for source and target objects - 3": function (test) {
        var expected = {
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
        var source = {
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
        var map = createMapper(source);
        map("articles.[0]").to("topStory");
        map("articles").to("otherStories", function (articles) {
            // We don't want to include the top story
            articles.shift();
            return articles;
        });
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    },
    "Multiple selections can be selected at once": function (test) {
        var expected = {
            "fruit": {
                "count": 7
            }
        };
        // Start example
        var source = {
            "apples": {
                "count": 3
            },
            "oranges": {
                "count": 4
            }
        };
        var map = createMapper(source);
        map(["apples.count", "oranges.count"]).to("fruit.count", function (appleCount, orangeCount) {
            return appleCount + orangeCount;
        });
        var result = map.execute();
        console.log(result);
        // End example
        test.deepEqual(result, expected);
        test.done();
    }
};
exports.examples = exampleGroup;
//# sourceMappingURL=examples-test.js.map