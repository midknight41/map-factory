"use strict";
var mod = require("object-mapper");
var objectMapper = mod;
var Mapper = (function () {
    function Mapper(obj) {
        this.assignment = [];
        this.sourceObject = new Object();
        this.mapCache = null;
        this.sourceObject = obj;
    }
    Mapper.prototype.registerMapping = function (mapping) {
        this.assignment.push(mapping);
    };
    Mapper.prototype.execute = function (sourceObject) {
        if (sourceObject === null || sourceObject === undefined) {
            sourceObject = this.sourceObject;
        }
        if (this.mapCache === null) {
            this.mapCache = this.createMapData();
        }
        var output = objectMapper(sourceObject, {}, this.mapCache.transform);
        return this.appendMultiSelections(sourceObject, output, this.mapCache.multiMaps);
    };
    Mapper.prototype.createMapData = function () {
        var mapData = {
            transform: {},
            multiMaps: []
        };
        for (var _i = 0, _a = this.assignment; _i < _a.length; _i++) {
            var item = _a[_i];
            var sourceKey = item.source;
            var target = item.target;
            if (Array.isArray(item.source)) {
                if (!target.transform)
                    throw new Error("Multiple selections must map to a transform. No transform provided.");
                mapData.multiMaps.push(item);
                continue;
            }
            ;
            if (!target)
                target = sourceKey;
            mapData.transform[sourceKey] = target;
        }
        return mapData;
    };
    Mapper.prototype.appendMultiSelections = function (source, target, multiMaps) {
        var output = target;
        for (var _i = 0, multiMaps_1 = multiMaps; _i < multiMaps_1.length; _i++) {
            var item = multiMaps_1[_i];
            var params = [];
            for (var _a = 0, _b = item.source; _a < _b.length; _a++) {
                var sourceKey = _b[_a];
                var value = objectMapper.getKeyValue(source, sourceKey);
                params.push(value);
            }
            var result = item.target.transform.apply(null, params);
            output = objectMapper.setKeyValue(output, item.target.key, result);
        }
        return output;
    };
    return Mapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Mapper;
//# sourceMappingURL=mapper.js.map