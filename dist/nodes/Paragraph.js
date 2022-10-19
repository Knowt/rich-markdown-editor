"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const Node_1 = __importDefault(require("./Node"));
const prosemirror_tables_1 = require("@knowt/prosemirror-tables");
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
const isInList_1 = __importDefault(require("../queries/isInList"));
class Paragraph extends Node_1.default {
    get name() {
        return "paragraph";
    }
    get schema() {
        return {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            toDOM: () => ["p", 0],
        };
    }
    keys({ type }) {
        return {
            "Shift-Ctrl-0": prosemirror_commands_1.setBlockType(type),
            Tab: (state, dispatch) => {
                if (prosemirror_tables_1.isInTable(state) ||
                    isNodeActive_1.default(state.schema.nodes.image)(state) ||
                    isNodeActive_1.default(state.schema.nodes.hr)(state) ||
                    isInList_1.default(state))
                    return;
                const { tr } = state;
                tr.insertText('    ');
                dispatch(tr);
            }
        };
    }
    commands({ type }) {
        return () => prosemirror_commands_1.setBlockType(type);
    }
    toMarkdown(state, node) {
        if (node.textContent.trim() === "" &&
            node.childCount === 0 &&
            !state.inTable) {
            state.write("\\\n");
        }
        else {
            state.renderInline(node);
            state.closeBlock(node);
        }
    }
    parseMarkdown() {
        return { block: "paragraph" };
    }
}
exports.default = Paragraph;
//# sourceMappingURL=Paragraph.js.map