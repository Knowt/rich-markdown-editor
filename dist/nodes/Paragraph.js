"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const Node_1 = __importDefault(require("./Node"));
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
const isParentParagraph_1 = require("../queries/isParentParagraph");
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
            Backspace: (state, dispatch) => {
                if (isParentParagraph_1.isParentParagraph(state)) {
                    const { selection, tr, doc } = state;
                    const parentParagraph = prosemirror_utils_1.findParentNode((node) => node.type.name === 'paragraph')(selection);
                    if (parentParagraph &&
                        selection.from === selection.to &&
                        parentParagraph.start === selection.from) {
                        const tablePos = selection.from - 2;
                        const paragraphText = parentParagraph.node.textContent;
                        const prevTable = prosemirror_utils_1.findParentNodeClosestToPos(doc.resolve(tablePos), (node) => node.type.name === 'table');
                        if (prevTable) {
                            const handleDispatch = (rangeEnd = 0) => {
                                const lastCellPos = tablePos - 3;
                                dispatch(tr.deleteRange(selection.from, selection.from + paragraphText.length + rangeEnd)
                                    .insertText(paragraphText, lastCellPos)
                                    .setSelection(prosemirror_state_1.TextSelection.near(tr.doc.resolve(lastCellPos))));
                            };
                            try {
                                handleDispatch(2);
                            }
                            catch (_a) {
                                handleDispatch();
                            }
                            return true;
                        }
                    }
                }
            },
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