"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
const prosemirror_tables_1 = require("@knowt/prosemirror-tables");
const isInList_1 = __importDefault(require("../queries/isInList"));
const isMarkActive_1 = __importStar(require("../queries/isMarkActive"));
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
const removeMarks_1 = __importDefault(require("../commands/removeMarks"));
const icons_1 = require("../icons");
function formattingMenuItems(view, isTemplate, dictionary) {
    const { state } = view;
    const { schema } = state;
    const isTable = prosemirror_tables_1.isInTable(state);
    const isList = isInList_1.default(state);
    const allowBlocks = !isTable && !isList;
    const allMarks = [
        schema.marks.highlight_default,
        schema.marks.highlight_orange,
        schema.marks.highlight_yellow,
        schema.marks.highlight_green,
        schema.marks.highlight_blue,
    ];
    return [
        {
            name: "placeholder",
            tooltip: dictionary.placeholder,
            icon: outline_icons_1.InputIcon,
            active: isMarkActive_1.default(schema.marks.placeholder),
            visible: isTemplate,
        },
        {
            name: "separator",
            visible: isTemplate,
        },
        {
            name: "strong",
            tooltip: dictionary.strong,
            icon: outline_icons_1.BoldIcon,
            active: isMarkActive_1.default(schema.marks.strong),
        },
        {
            name: "strikethrough",
            tooltip: dictionary.strikethrough,
            icon: outline_icons_1.StrikethroughIcon,
            active: isMarkActive_1.default(schema.marks.strikethrough),
        },
        {
            name: "separator",
            visible: allowBlocks,
        },
        {
            name: "highlight_default",
            tooltip: "Red Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_default.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_default),
            visible: !isTemplate,
        },
        {
            name: "highlight_orange",
            tooltip: "Orange Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_orange.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_orange),
            visible: !isTemplate,
        },
        {
            name: "highlight_yellow",
            tooltip: "Yellow Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_yellow.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_yellow),
            visible: !isTemplate,
        },
        {
            name: "highlight_green",
            tooltip: "Green Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_green.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_green),
            visible: !isTemplate,
        },
        {
            name: "highlight_blue",
            tooltip: "Blue Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_blue.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_blue),
            visible: !isTemplate,
        },
        {
            name: "highlight_remove",
            tooltip: "Remove All Highlights",
            icon: icons_1.RemoveIcon,
            iconColor: "#fff",
            active: isMarkActive_1.isAnyMarkActive(allMarks),
            visible: !isTemplate,
            customOnClick: () => removeMarks_1.default(view, allMarks),
        },
        {
            name: "separator",
            visible: allowBlocks,
        },
        {
            name: "code_inline",
            tooltip: dictionary.codeInline,
            icon: outline_icons_1.CodeIcon,
            active: isMarkActive_1.default(schema.marks.code_inline),
        },
        {
            name: "separator",
            visible: allowBlocks,
        },
        {
            name: "heading",
            tooltip: dictionary.heading,
            icon: outline_icons_1.Heading1Icon,
            active: isNodeActive_1.default(schema.nodes.heading, { level: 1 }),
            attrs: { level: 1 },
            visible: allowBlocks,
        },
        {
            name: "heading",
            tooltip: dictionary.subheading,
            icon: outline_icons_1.Heading2Icon,
            active: isNodeActive_1.default(schema.nodes.heading, { level: 2 }),
            attrs: { level: 2 },
            visible: allowBlocks,
        },
        {
            name: "blockquote",
            tooltip: dictionary.quote,
            icon: outline_icons_1.BlockQuoteIcon,
            active: isNodeActive_1.default(schema.nodes.blockquote),
            attrs: { level: 2 },
            visible: allowBlocks,
        },
        {
            name: "separator",
            visible: allowBlocks || isList,
        },
        {
            name: "checkbox_list",
            tooltip: dictionary.checkboxList,
            icon: outline_icons_1.TodoListIcon,
            keywords: "checklist checkbox task",
            active: isNodeActive_1.default(schema.nodes.checkbox_list),
            visible: allowBlocks || isList,
        },
        {
            name: "bullet_list",
            tooltip: dictionary.bulletList,
            icon: outline_icons_1.BulletedListIcon,
            active: isNodeActive_1.default(schema.nodes.bullet_list),
            visible: allowBlocks || isList,
        },
        {
            name: "ordered_list",
            tooltip: dictionary.orderedList,
            icon: outline_icons_1.OrderedListIcon,
            active: isNodeActive_1.default(schema.nodes.ordered_list),
            visible: allowBlocks || isList,
        },
        {
            name: "separator",
        },
        {
            name: "link",
            tooltip: dictionary.createLink,
            icon: outline_icons_1.LinkIcon,
            active: isMarkActive_1.default(schema.marks.link),
            attrs: { href: "" },
        },
    ];
}
exports.default = formattingMenuItems;
//# sourceMappingURL=formatting.js.map