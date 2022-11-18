"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParentParagraph = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const isParentParagraph = (state) => {
    var _a;
    const selection = state.selection;
    const $head = selection.$head;
    return selection instanceof prosemirror_state_1.TextSelection &&
        ((_a = $head === null || $head === void 0 ? void 0 : $head.path) === null || _a === void 0 ? void 0 : _a.length) === 6 &&
        $head.parent.type.name === 'paragraph';
};
exports.isParentParagraph = isParentParagraph;
//# sourceMappingURL=isParentParagraph.js.map