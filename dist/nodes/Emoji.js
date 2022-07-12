"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const name_to_emoji_json_1 = __importDefault(require("gemoji/name-to-emoji.json"));
const Node_1 = __importDefault(require("./Node"));
const emoji_1 = __importDefault(require("../rules/emoji"));
class Emoji extends Node_1.default {
    get name() {
        return "emoji";
    }
    get schema() {
        return {
            attrs: {
                style: {
                    default: "",
                },
                "data-name": {
                    default: undefined,
                },
            },
            inline: true,
            content: "text*",
            marks: "",
            group: "inline",
            selectable: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "span.emoji",
                    preserveWhitespace: "full",
                    getAttrs: (dom) => ({
                        "data-name": dom.dataset.name,
                    }),
                },
            ],
            toDOM: (node) => {
                if (name_to_emoji_json_1.default[node.attrs["data-name"]]) {
                    return [
                        "span",
                        {
                            class: `emoji ${node.attrs["data-name"]}`,
                            "data-name": node.attrs["data-name"],
                        },
                        name_to_emoji_json_1.default[node.attrs["data-name"]],
                    ];
                }
                return ["span", { class: "emoji" }, `:${node.attrs["data-name"]}:`];
            },
        };
    }
    get rulePlugins() {
        return [emoji_1.default];
    }
    commands({ type }) {
        return (attrs) => (state, dispatch) => {
            const { selection } = state;
            const position = selection.$cursor
                ? selection.$cursor.pos
                : selection.$to.pos;
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
            return true;
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(/^\:([a-zA-Z0-9_+-]+)\:$/, (state, match, start, end) => {
                const [okay, markup] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start - 1, end, type.create({
                        "data-name": markup,
                        markup,
                    }));
                }
                return tr;
            }),
        ];
    }
    toMarkdown(state, node) {
        const name = node.attrs["data-name"];
        if (name) {
            state.write(`:${name}:`);
        }
    }
    parseMarkdown() {
        return {
            node: "emoji",
            getAttrs: (tok) => {
                return { "data-name": tok.markup.trim() };
            },
        };
    }
}
exports.default = Emoji;
//# sourceMappingURL=Emoji.js.map