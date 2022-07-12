"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const Node_1 = __importDefault(require("./Node"));
const checkboxes_1 = __importDefault(require("../rules/checkboxes"));
const customSplitListItem_1 = require("../commands/customSplitListItem");
class CheckboxItem extends Node_1.default {
    constructor() {
        super(...arguments);
        this.handleChange = (event) => {
            const { view } = this.editor;
            const { tr } = view.state;
            const { top, left } = event.target.getBoundingClientRect();
            const result = view.posAtCoords({ top, left });
            if (result) {
                const transaction = tr.setNodeMarkup(result.inside, undefined, {
                    checked: event.target.checked
                });
                view.dispatch(transaction);
            }
        };
    }
    get name() {
        return "checkbox_item";
    }
    get schema() {
        return {
            attrs: {
                checked: {
                    default: false
                }
            },
            content: "paragraph block*",
            defining: true,
            draggable: true,
            parseDOM: [
                {
                    tag: `li[data-type="${this.name}"]`,
                    getAttrs: (dom) => ({
                        checked: dom.className.includes("checked")
                    })
                }
            ],
            toDOM: (node) => {
                const isServer = typeof document === "undefined";
                let input;
                if (isServer) {
                    input = [
                        "input",
                        Object.assign({ type: "checkbox", tabindex: -1 }, (node.attrs.checked && { checked: true }))
                    ];
                }
                else {
                    input = document.createElement("input");
                    input.type = "checkbox";
                    input.tabIndex = -1;
                    input.addEventListener("change", this.handleChange);
                    if (node.attrs.checked) {
                        input.checked = true;
                    }
                }
                return [
                    "li",
                    {
                        "data-type": this.name,
                        class: node.attrs.checked ? "checked" : undefined
                    },
                    [
                        "span",
                        {
                            contentEditable: false
                        },
                        input
                    ],
                    ["div", 0]
                ];
            }
        };
    }
    get rulePlugins() {
        return [checkboxes_1.default];
    }
    keys({ type }) {
        return {
            Enter: customSplitListItem_1.customSplitListItem(type),
            Tab: prosemirror_schema_list_1.sinkListItem(type),
            "Shift-Tab": prosemirror_schema_list_1.liftListItem(type),
            "Mod-]": prosemirror_schema_list_1.sinkListItem(type),
            "Mod-[": prosemirror_schema_list_1.liftListItem(type)
        };
    }
    toMarkdown(state, node) {
        state.write(node.attrs.checked ? "[x] " : "[ ] ");
        state.renderContent(node);
    }
    parseMarkdown() {
        return {
            block: "checkbox_item",
            getAttrs: (tok) => ({
                checked: tok.attrGet("checked") ? true : undefined
            })
        };
    }
}
exports.default = CheckboxItem;
//# sourceMappingURL=CheckboxItem.js.map