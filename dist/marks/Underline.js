"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const markInputRule_1 = __importDefault(require("../lib/markInputRule"));
const Mark_1 = __importDefault(require("./Mark"));
const underlines_1 = __importDefault(require("../rules/underlines"));
const constants_1 = require("../lib/constants");
class Underline extends Mark_1.default {
    get name() {
        return "underline";
    }
    get schema() {
        return {
            parseDOM: [
                { tag: "u" },
                { tag: "underline" },
                {
                    style: "text-decoration",
                    getAttrs: (value) => value === "underline",
                },
            ],
            toDOM: () => ["u", 0],
        };
    }
    get rulePlugins() {
        return [underlines_1.default];
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:__)([^_]+)(?:__)$/, type)];
    }
    keys({ type }) {
        return {
            [constants_1.UNDERLINE_SHORTCUT1]: prosemirror_commands_1.toggleMark(type),
            [constants_1.UNDERLINE_SHORTCUT2]: prosemirror_commands_1.toggleMark(type),
        };
    }
    get toMarkdown() {
        return {
            open: "__",
            close: "__",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "underline" };
    }
}
exports.default = Underline;
//# sourceMappingURL=Underline.js.map