"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
const prosemirror_commands_1 = require("prosemirror-commands");
class BlueHighlight extends Mark_1.default {
    get name() {
        return "highlight_blue";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#D9EDFF",
                },
            },
            excludes: "highlight",
            group: "highlight",
            parseDOM: [
                {
                    tag: "mark",
                    getAttrs: (node) => node.getAttribute("class") === "blue",
                },
                {
                    style: "background-color",
                    getAttrs: (value) => !!value && value === "blue",
                },
            ],
            toDOM: () => ["mark", { class: "blue" }],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:\^\^)([^=]+)(?:\^\^)$/, type)];
    }
    keys({ type }) {
        return {
            "Alt-Shift-5": prosemirror_commands_1.toggleMark(type),
        };
    }
    commands({ type }) {
        return () => prosemirror_commands_1.toggleMark(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "^^", mark: "highlight_blue" })];
    }
    get toMarkdown() {
        return {
            open: "^^",
            close: "^^",
            mixable: true,
            expelEnclosingWhitespace: true,
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "highlight_blue" };
    }
}
exports.default = BlueHighlight;
//# sourceMappingURL=BlueHighlight.js.map