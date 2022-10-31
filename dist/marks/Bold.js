"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../lib/markInputRule"));
const Mark_1 = __importDefault(require("./Mark"));
const constants_1 = require("../lib/constants");
class Bold extends Mark_1.default {
    get name() {
        return "strong";
    }
    get schema() {
        return {
            parseDOM: [
                { tag: "strong" },
                { style: "font-style", getAttrs: (value) => value === "bold" },
                {
                    style: "font-weight",
                    getAttrs: (value) => ["700", "800", "900", "bold", "bolder"].includes(value),
                },
            ],
            toDOM: () => ["strong"],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:\*\*)([^*]+)(?:\*\*)$/, type)];
    }
    keys({ type }) {
        return {
            [constants_1.BOLD_SHORTCUT1]: prosemirror_commands_1.toggleMark(type),
            [constants_1.BOLD_SHORTCUT2]: prosemirror_commands_1.toggleMark(type),
        };
    }
    get toMarkdown() {
        return {
            open: "**",
            close: "**",
            mixable: true,
            expelEnclosingWhitespace: true,
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "strong" };
    }
}
exports.default = Bold;
//# sourceMappingURL=Bold.js.map