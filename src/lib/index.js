import createMapper from "./map-factory";
import { getValueOld, setValue } from "./object-mapper/object-mapper";

module.exports = createMapper;
module.exports.getValue = getValueOld;
module.exports.setValue = setValue;
