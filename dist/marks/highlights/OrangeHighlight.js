"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
const prosemirror_commands_1 = require("prosemirror-commands");
const constants_1 = require("../../lib/constants");
class OrangeHighlight extends Mark_1.default {
    get name() {
        return "highlight_orange";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#FCE7D2",
                },
            },
            excludes: "highlight",
            group: "highlight",
            parseDOM: [
                {
                    tag: "mark",
                    getAttrs: (node) => node.getAttribute("class") === "orange",
                },
                {
                    style: "background-color",
                    getAttrs: (value) => !!value && value === "orange",
                },
            ],
            toDOM: () => ["mark", { class: "orange" }],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:@@)([^=]+)(?:@@)$/, type)];
    }
    keys({ type }) {
        return {
            [constants_1.ORANGE_HIGHLIGHT_SHORTCUT]: prosemirror_commands_1.toggleMark(type),
        };
    }
    commands({ type }) {
        return () => prosemirror_commands_1.toggleMark(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "@@", mark: "highlight_orange" })];
    }
    get toMarkdown() {
        return {
            open: "@@",
            close: "@@",
            mixable: true,
            expelEnclosingWhitespace: true,
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "highlight_orange" };
    }
}
exports.default = OrangeHighlight;
//# sourceMappingURL=OrangeHighlight.js.map