"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isMarkActive_1 = __importDefault(require("./isMarkActive"));
function isHeading(state) {
    if (state.schema.nodes.heading) {
        const $head = state.selection.$head;
        return $head.parent.type === state.schema.nodes.heading;
    }
    return isMarkActive_1.default(state.schema.marks.heading)(state);
}
exports.default = isHeading;
//# sourceMappingURL=isHeading.js.map