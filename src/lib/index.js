import createMapper from "./map-factory";
import { getValue, setValue } from "./object-mapper/object-mapper";

module.exports = createMapper;
module.exports.getValue = getValue;
module.exports.setValue = setValue;
