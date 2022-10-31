"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markInputRule_1 = __importDefault(require("../../lib/markInputRule"));
const Mark_1 = __importDefault(require("../Mark"));
const mark_1 = __importDefault(require("../../rules/mark"));
const toggleMarkBackground_1 = require("../../commands/toggleMarkBackground");
const constants_1 = require("../../lib/constants");
class GreenBackground extends Mark_1.default {
    get name() {
        return "background_green";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#E4FCD7",
                },
            },
            excludes: "background",
            group: "background",
            parseDOM: [
                {
                    tag: `mark[data-type="background-green"]`,
                },
            ],
            toDOM: () => [
                "mark",
                {
                    class: 'background green',
                    'data-type': 'background-green',
                },
            ],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:}})([^=]+)(?:}})$/, type)];
    }
    keys({ type }) {
        return {
            [constants_1.GREEN_BACKGROUND_SHORTCUT]: toggleMarkBackground_1.toggleMarkBackground(type),
        };
    }
    commands({ type }) {
        return () => toggleMarkBackground_1.toggleMarkBackground(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "}}", mark: "background_green" })];
    }
    get toMarkdown() {
        return {
            open: "}}",
            close: "}}",
            mixable: true,
            expelEnclosingWhitespace: true,
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "background_green" };
    }
}
exports.default = GreenBackground;
//# sourceMappingURL=GreenBackground.js.map