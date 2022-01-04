"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
class GreenHighlight extends Mark_1.default {
    get name() {
        return "highlight_green";
    }
    get schema() {
        return {
            parseDOM: [
                {
                    tag: "mark",
                    getAttrs: (node) => node.getAttribute("class") === "green",
                },
                {
                    style: "background-color",
                    getAttrs: (value) => !!value && value === "green",
                },
            ],
            toDOM: () => ["mark", { class: "green" }],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:%%)([^=]+)(?:%%)$/, type)];
    }
    keys({ type }) {
        return {};
    }
    commands({ type }) {
        return () => prosemirror_commands_1.toggleMark(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "%%", mark: "highlight_green" })];
    }
    get toMarkdown() {
        return {
            open: "%%",
            close: "%%",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "highlight_green" };
    }
}
exports.default = GreenHighlight;
//# sourceMappingURL=GreenHighlight.js.map