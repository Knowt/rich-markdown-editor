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
class BlueBackground extends Mark_1.default {
    get name() {
        return "background_blue";
    }
    get schema() {
        return {
            attrs: {
                color: {
                    default: "#D9EDFF",
                },
            },
            excludes: "background",
            group: "background",
            parseDOM: [
                {
                    tag: `mark[data-type="background-blue"]`,
                },
            ],
            toDOM: () => [
                "mark",
                {
                    class: 'background blue',
                    'data-type': 'background-blue',
                },
            ],
        };
    }
    inputRules({ type }) {
        return [markInputRule_1.default(/(?:<<)([^=]+)(?:<<)$/, type)];
    }
    keys({ type }) {
        return {
            [constants_1.BLUE_BACKGROUND_SHORTCUT]: toggleMarkBackground_1.toggleMarkBackground(type),
        };
    }
    commands({ type }) {
        return () => toggleMarkBackground_1.toggleMarkBackground(type);
    }
    get rulePlugins() {
        return [mark_1.default({ delim: "<<", mark: "background_blue" })];
    }
    get toMarkdown() {
        return {
            open: "<<",
            close: "<<",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "background_blue" };
    }
}
exports.default = BlueBackground;
//# sourceMappingURL=BlueBackground.js.map