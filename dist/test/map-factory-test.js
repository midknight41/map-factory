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
        var map = map_factory_1["default"](source);
        map("fieldName").to("field.name");
        var actual = map.execute();
        test.deepEqual(actual, expected);
        test.done();
    },
    "A field that doesn't exists on the source doesn't affect the resulting object": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1["default"](source);
        map("fieldName").to("field.name");
        map("fieldId").to("field.name");
        var actual = map.execute();
        test.deepEqual(actual, expected);
        test.done();
    },
    "A null source field throws an error": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1["default"](source);
        test.throws(function () {
            map(null).to("field.name");
        });
        test.done();
    },
    "A null target field throws an error": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = map_factory_1["default"](source);
        test.throws(function () {
            map("fieldName").to(null);
        });
        test.done();
    },
    "The source field is used if not target field is provided": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var map = map_factory_1["default"](source);
        map("fieldName");
        var actual = map.execute();
        test.deepEqual(actual, source, "field was not mapped to new object");
        test.done();
    }
};
var customFunctionsGroup = {
    "Calls a function and alters the resulting object": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "altered"
            }
        };
        var map = map_factory_1["default"](source);
        map("fieldName").to("field.name", function (value) { return "altered"; });
        var actual = map.execute();
        test.deepEqual(actual, expected, "field was not mapped to new object");
        test.done();
    }
};
var multipleSelectionGroup = {
    "Can extract multiple selections into a single transform": function (test) {
        var source = {
            "group1": {
                "name": "A"
            },
            "group2": {
                "name": "B"
            }
        };
        var expected = {
            "merged": { "names": ["A", "B"] }
        };
        var map = map_factory_1["default"](source);
        map(["group1", "group2"]).to("merged", function (group1, group2) {
            return { "names": [group1.name, group2.name] };
        });
        var actual = map.execute();
        test.deepEqual(actual, expected, "field was not mapped to new object");
        test.done();
    },
    "Can extract multiple selections into a single transform while allowing simpler mappings to work": function (test) {
        var source = {
            "person": {
                "name": "joe"
            },
            "group1": {
                "name": "A"
            },
            "group2": {
                "name": "B"
            }
        };
        var expected = {
            "name": "joe",
            "merged": { "groups": ["A", "B"] }
        };
        var map = map_factory_1["default"](source);
        map("person.name").to("name");
        map(["group1", "group2"]).to("merged", function (group1, group2) {
            return { "groups": [group1.name, group2.name] };
        });
        var actual = map.execute();
        test.deepEqual(actual, expected, "field was not mapped to new object");
        test.done();
    },
    "If Multiple selections aren't mapped to a transform and error will occur": function (test) {
        var source = {
            "person": {
                "name": "joe"
            },
            "group1": {
                "name": "A"
            },
            "group2": {
                "name": "B"
            }
        };
        var expected = {
            "name": "joe",
            "merged": { "groups": ["A", "B"] }
        };
        var map = map_factory_1["default"](source);
        map("person.name").to("name");
        map(["group1", "group2"]).to("merged");
        test.throws(function () {
            var actual = map.execute();
        });
        test.done();
    }
};
exports.basicMapping = basicMappingGroup;
exports.customFunctions = customFunctionsGroup;
exports.multipleSelection = multipleSelectionGroup;
//# sourceMappingURL=map-factory-test.js.map