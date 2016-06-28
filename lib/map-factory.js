"use strict";
var mod = require("object-mapper");
var objectMapper = mod;
function createMapper(obj) {
    var me = {
        assignment: []
    };
    var map = function map(source) {
        this.sourceObject = obj;
        var mapping = new Mapping(source);
        this.assignment.push(mapping);
        return mapping;
    }.bind(me);
    map.execute = function () {
        var transform = {};
        for (var _i = 0, _a = this.assignment; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.target)
                item.target = item.source;
            transform[item.source] = item.target;
        }
        return objectMapper(me.sourceObject, transform);
    }.bind(me);
    return map;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createMapper;
var Mapping = (function () {
    function Mapping(source) {
        if (!source)
            throw new Error("the source field name cannot be null");
        this.source = source;
    }
    Mapping.prototype.to = function (target, fnc) {
        if (!target)
            throw new Error("the target field name cannot be null");
        if (fnc) {
            this.target = {
                key: target,
                transform: fnc
            };
            return;
        }
        this.target = target;
    };
    return Mapping;
}());
//# sourceMappingURL=map-factory.js.map