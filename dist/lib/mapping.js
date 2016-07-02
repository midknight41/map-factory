"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Mapping;
//# sourceMappingURL=mapping.js.map