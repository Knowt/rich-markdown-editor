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
const getLastListItemDepth_1 = require("../queries/getLastListItemDepth");
const isList_1 = __importDefault(require("../queries/isList"));
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
                var _a;
                if (isParentParagraph_1.isParentParagraph(state)) {
                    const { selection, tr, doc, schema } = state;
                    const parentParagraph = prosemirror_utils_1.findParentNode((node) => node.type.name === 'paragraph')(selection);
                    if (parentParagraph &&
                        selection.from === selection.to &&
                        parentParagraph.start === selection.from) {
                        const prevNodePos = selection.from - 2;
                        const newPos = doc.resolve(prevNodePos);
                        let backspacePos = undefined;
                        const prevTable = prosemirror_utils_1.findParentNodeClosestToPos(newPos, (node) => node.type.name === 'table');
                        if (prevTable) {
                            backspacePos = prevNodePos - 3;
                        }
                        const prevList = prosemirror_utils_1.findParentNodeClosestToPos(newPos, (node) => isList_1.default(node, schema));
                        if (prevList) {
                            const steps = getLastListItemDepth_1.getLastListItemDepth(prevList.node);
                            backspacePos = selection.from - 4 - steps * 2;
                        }
                        const prevBlockQuote = prosemirror_utils_1.findParentNodeClosestToPos(newPos, (node) => node.type.name === 'blockquote');
                        if (prevBlockQuote) {
                            backspacePos = selection.from - 3;
                            const innerNodes = (_a = prevBlockQuote.node.content) === null || _a === void 0 ? void 0 : _a.content;
                            const lastNode = innerNodes[innerNodes.length - 1];
                            const lastNodeType = lastNode.type.name;
                            if (lastNodeType === 'checkbox_list' ||
                                lastNodeType === 'bullet_list' ||
                                lastNodeType === 'ordered_list') {
                                backspacePos -= (getLastListItemDepth_1.getLastListItemDepth(lastNode) + 1) * 2;
                            }
                            else if (lastNodeType === 'table') {
                                backspacePos -= 3;
                            }
                        }
                        if (typeof backspacePos === 'number') {
                            const paragraphText = parentParagraph.node.textContent;
                            const handleDispatch = (rangeEnd = 0) => {
                                dispatch(tr.deleteRange(selection.from, selection.from + paragraphText.length + rangeEnd)
                                    .insertText(paragraphText, backspacePos)
                                    .setSelection(prosemirror_state_1.TextSelection.near(tr.doc.resolve(backspacePos))));
                            };
                            try {
                                handleDispatch(2);
                            }
                            catch (_b) {
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