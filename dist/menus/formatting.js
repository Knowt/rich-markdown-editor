"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
const prosemirror_tables_1 = require("@knowt/prosemirror-tables");
const isInList_1 = __importDefault(require("../queries/isInList"));
const isMarkActive_1 = __importDefault(require("../queries/isMarkActive"));
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
const isSelectionEmpty_1 = __importDefault(require("../queries/isSelectionEmpty"));
const isHeading_1 = __importDefault(require("../queries/isHeading"));
function formattingMenuItems(view, isTemplate, dictionary) {
    const { state } = view;
    const { schema, selection } = state;
    const isTable = prosemirror_tables_1.isInTable(state);
    const isList = isInList_1.default(state);
    const isSelectionEmpty = isSelectionEmpty_1.default(selection);
    const isSelHeading = isHeading_1.default(state);
    const allowBlocks = !isTable && !isList;
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
            visible: !isSelectionEmpty,
        },
        {
            name: "strikethrough",
            tooltip: dictionary.strikethrough,
            icon: outline_icons_1.StrikethroughIcon,
            active: isMarkActive_1.default(schema.marks.strikethrough),
            visible: !isSelectionEmpty,
        },
        {
            name: "code_inline",
            tooltip: dictionary.codeInline,
            icon: outline_icons_1.CodeIcon,
            active: isMarkActive_1.default(schema.marks.code_inline),
        },
        {
            name: "separator",
            visible: !isSelectionEmpty,
        },
        {
            name: "highlight_blue",
            tooltip: "Blue Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_blue.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_blue),
            visible: !isTemplate && !isSelectionEmpty,
        },
        {
            name: "highlight_yellow",
            tooltip: "Yellow Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_yellow.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_yellow),
            visible: !isTemplate && !isSelectionEmpty,
        },
        {
            name: "separator",
            visible: allowBlocks,
        },
        {
            name: "heading",
            tooltip: dictionary.h1,
            icon: outline_icons_1.Heading1Icon,
            active: isNodeActive_1.default(schema.nodes.heading, { level: 1 }),
            attrs: { level: 1 },
            visible: allowBlocks,
        },
        {
            name: "heading",
            tooltip: dictionary.h2,
            icon: outline_icons_1.Heading2Icon,
            active: isNodeActive_1.default(schema.nodes.heading, { level: 2 }),
            attrs: { level: 2 },
            visible: allowBlocks,
        },
        {
            name: "heading",
            tooltip: dictionary.h3,
            icon: outline_icons_1.Heading3Icon,
            active: isNodeActive_1.default(schema.nodes.heading, { level: 3 }),
            attrs: { level: 3 },
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
            visible: (allowBlocks || isList) && !isSelHeading,
        },
        {
            name: "checkbox_list",
            tooltip: dictionary.checkboxList,
            icon: outline_icons_1.TodoListIcon,
            keywords: "checklist checkbox task",
            active: isNodeActive_1.default(schema.nodes.checkbox_list),
            visible: (allowBlocks || isList) && !isSelHeading,
        },
        {
            name: "bullet_list",
            tooltip: dictionary.bulletList,
            icon: outline_icons_1.BulletedListIcon,
            active: isNodeActive_1.default(schema.nodes.bullet_list),
            visible: (allowBlocks || isList) && !isSelHeading,
        },
        {
            name: "ordered_list",
            tooltip: dictionary.orderedList,
            icon: outline_icons_1.OrderedListIcon,
            active: isNodeActive_1.default(schema.nodes.ordered_list),
            visible: (allowBlocks || isList) && !isSelHeading,
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