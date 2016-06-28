"use strict";
var map_factory_1 = require("../lib/map-factory");
// var createMapper = require("../lib/index");
var basicMappingGroup = {
    "Can map one field that exists to another": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1.default(source);
        map("fieldName").to("field.name");
        var actual = map.execute();
        test.deepEqual(actual, expected);
        test.done();
    },
    "A field that doesn't exists on the source doesn't affect the resulting object": function (test) {
        var source = {
            "fieldName": "name1",
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1.default(source);
        map("fieldName").to("field.name");
        map("fieldId").to("field.name");
        var actual = map.execute();
        test.deepEqual(actual, expected);
        test.done();
    },
    "A null source field throws an error": function (test) {
        var source = {
            "fieldName": "name1",
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1.default(source);
        test.throws(function () {
            map(null).to("field.name");
        });
        test.done();
    },
    "A null target field throws an error": function (test) {
        var source = {
            "fieldName": "name1",
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1.default(source);
        test.throws(function () {
            map("fieldName").to(null);
        });
        test.done();
    },
    "The source field is used if not target field is provided": function (test) {
        var source = {
            "fieldName": "name1",
        };
        var map = map_factory_1.default(source);
        map("fieldName");
        var actual = map.execute();
        test.deepEqual(actual, source, "field was not mapped to new object");
        test.done();
    }
};
var customFunctionsGroup = {
    "Calls a function and alters the resulting object": function (test) {
        var source = {
            "fieldName": "name1",
        };
        var expected = {
            "field": {
                "name": "altered"
            }
        };
        var map = map_factory_1.default(source);
        map("fieldName").to("field.name", function (value) { return "altered"; });
        var actual = map.execute();
        test.deepEqual(actual, expected, "field was not mapped to new object");
        test.done();
    }
};
exports.basicMapping = basicMappingGroup;
exports.customFunctions = customFunctionsGroup;
//# sourceMappingURL=map-factory-test.js.map