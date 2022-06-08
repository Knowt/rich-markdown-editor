"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_utils_knowt_1 = require("prosemirror-utils-knowt");
const findCollapsedNodes_1 = __importDefault(require("../queries/findCollapsedNodes"));
function splitHeading(type) {
    return (state, dispatch) => {
        const { $from, from, $to, to } = state.selection;
        if ($from.parent.type !== type)
            return false;
        const endPos = $to.after() - 1;
        if (endPos !== to)
            return false;
        if (!$from.parent.attrs.collapsed)
            return false;
        const allBlocks = prosemirror_utils_knowt_1.findBlockNodes(state.doc);
        const collapsedBlocks = findCollapsedNodes_1.default(state.doc);
        const visibleBlocks = allBlocks.filter((a) => !collapsedBlocks.find((b) => b.pos === a.pos));
        const nextVisibleBlock = visibleBlocks.find((a) => a.pos > from);
        const pos = nextVisibleBlock
            ? nextVisibleBlock.pos
            : state.doc.content.size;
        const transaction = state.tr.insert(pos, type.create(Object.assign(Object.assign({}, $from.parent.attrs), { collapsed: false })));
        dispatch(transaction
            .setSelection(prosemirror_state_1.TextSelection.near(transaction.doc.resolve(Math.min(pos + 1, transaction.doc.content.size))))
            .scrollIntoView());
        return true;
    };
}
exports.default = splitHeading;
//# sourceMappingURL=splitHeading.js.map