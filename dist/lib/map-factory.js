"use strict";
var mapper_1 = require("./mapper");
var mapping_1 = require("./mapping");
function createMapper(obj) {
    var me = {
        mapper: new mapper_1["default"](obj)
    };
    var map = function map(source) {
        var mapping = new mapping_1["default"](source);
        this.mapper.registerMapping(mapping);
        return mapping;
    }.bind(me);
    map.execute = function () {
        return this.mapper.execute();
    }.bind(me);
    return map;
}
exports.__esModule = true;
exports["default"] = createMapper;
//# sourceMappingURL=map-factory.js.map