"use strict";
var createMapper = require("../lib/index");
var basicMappingGroup = {
    "Can require the module from ES5 land": function (test) {
        var source = {
            "fieldName": "name1"
        };
        var expected = {
            "field": {
                "name": "name1"
            }
        };
        var map = createMapper(source);
        map("fieldName").to("field.name");
        var actual = map.execute();
        test.deepEqual(actual, expected);
        test.done();
    }
};
exports.basicMapping = basicMappingGroup;
//# sourceMappingURL=index-test.js.map