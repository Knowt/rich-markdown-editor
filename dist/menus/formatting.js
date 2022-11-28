"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
const icons_1 = require("../icons");
const prosemirror_tables_1 = require("@knowt/prosemirror-tables");
const isInList_1 = __importDefault(require("../queries/isInList"));
const isMarkActive_1 = __importDefault(require("../queries/isMarkActive"));
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
const isSelectionEmpty_1 = __importDefault(require("../queries/isSelectionEmpty"));
const isHeading_1 = __importDefault(require("../queries/isHeading"));
const parseShortcut_1 = require("../lib/parseShortcut");
const constants_1 = require("../lib/constants");
const organizeMenuItemByDefault = (input) => {
    var _a;
    const { items, name, orientation, setFn, commands, tooltip } = input;
    let organizedItem = {};
    const subItems = [];
    const handleMenuItemCustomOnClick = (name, setFn) => {
        commands[name]();
        setFn && setFn(name);
    };
    const addCustomOnClickToSubMenuItems = (items) => {
        return items.map((item) => {
            var _a;
            return (Object.assign(Object.assign({}, item), { tooltip: (_a = item.tooltip) === null || _a === void 0 ? void 0 : _a.split(' ')[0], customOnClick: () => handleMenuItemCustomOnClick(item.name, setFn) }));
        });
    };
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.name === name) {
            const nextIndex = i + 1;
            organizedItem = Object.assign(Object.assign({}, item), { subItems: {
                    orientation,
                    tooltip,
                    items: nextIndex < items.length ?
                        [
                            ...addCustomOnClickToSubMenuItems(subItems),
                            ...addCustomOnClickToSubMenuItems(items.slice(nextIndex)),
                        ] :
                        addCustomOnClickToSubMenuItems(subItems),
                } });
            break;
        }
        else {
            subItems.push(Object.assign(Object.assign({}, item), { tooltip: (_a = item.tooltip) === null || _a === void 0 ? void 0 : _a.split(' ')[0], customOnClick: () => handleMenuItemCustomOnClick(item.name, setFn) }));
        }
    }
    return organizedItem;
};
function formattingMenuItems(input) {
    const { view, isTemplate, dictionary, deviceType, commands, defaultHighlight = constants_1.DEFAULT_HIGHLIGHT, defaultBackground = constants_1.DEFAULT_BACKGROUND, setDefaultBackground, setDefaultHighlight, } = input;
    const { state } = view;
    const { schema, selection } = state;
    const isTable = prosemirror_tables_1.isInTable(state);
    const isList = isInList_1.default(state);
    const isSelectionEmpty = isSelectionEmpty_1.default(selection);
    const isSelHeading = isHeading_1.default(state);
    const allowBlocks = !isTable && !isList;
    const ALL_HIGHLIGHTS = [
        {
            name: "highlight_red",
            tooltip: "Red Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_red.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_red),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.ORANGE_HIGHLIGHT_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "highlight_orange",
            tooltip: "Orange Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_orange.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_orange),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.BLUE_HIGHLIGHT_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "highlight_yellow",
            tooltip: "Yellow Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_yellow.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_yellow),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.YELLOW_HIGHLIGHT_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "highlight_green",
            tooltip: "Green Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_green.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_green),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.GREEN_HIGHLIGHT_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "highlight_blue",
            tooltip: "Blue Highlight",
            icon: outline_icons_1.HighlightIcon,
            iconColor: schema.marks.highlight_blue.attrs.color.default,
            active: isMarkActive_1.default(schema.marks.highlight_blue),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.BLUE_HIGHLIGHT_SHORTCUT,
                deviceType,
            }),
        },
    ];
    const ALL_BACKGROUNDS = [
        {
            name: "background_red",
            tooltip: "Red Background",
            icon: icons_1.CircleIcon,
            iconSVGProps: {
                r: constants_1.BACKGROUND_RADIUS,
                cx: constants_1.BACKGROUND_RADIUS,
                cy: constants_1.BACKGROUND_RADIUS,
                fill: schema.marks.background_red.attrs.color.default,
                size: constants_1.BACKGROUND_ICON_SIZE,
            },
            active: isMarkActive_1.default(schema.marks.background_red),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.RED_BACKGROUND_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "background_orange",
            tooltip: "Orange Background",
            icon: icons_1.CircleIcon,
            iconSVGProps: {
                r: constants_1.BACKGROUND_RADIUS,
                cx: constants_1.BACKGROUND_RADIUS,
                cy: constants_1.BACKGROUND_RADIUS,
                fill: schema.marks.background_orange.attrs.color.default,
                size: constants_1.BACKGROUND_ICON_SIZE,
            },
            active: isMarkActive_1.default(schema.marks.background_orange),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.ORANGE_BACKGROUND_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "background_yellow",
            tooltip: "Yellow Background",
            icon: icons_1.CircleIcon,
            iconSVGProps: {
                r: constants_1.BACKGROUND_RADIUS,
                cx: constants_1.BACKGROUND_RADIUS,
                cy: constants_1.BACKGROUND_RADIUS,
                fill: schema.marks.background_yellow.attrs.color.default,
                size: constants_1.BACKGROUND_ICON_SIZE,
            },
            active: isMarkActive_1.default(schema.marks.background_yellow),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.YELLOW_BACKGROUND_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "background_green",
            tooltip: "Green Background",
            icon: icons_1.CircleIcon,
            iconSVGProps: {
                r: constants_1.BACKGROUND_RADIUS,
                cx: constants_1.BACKGROUND_RADIUS,
                cy: constants_1.BACKGROUND_RADIUS,
                fill: schema.marks.background_green.attrs.color.default,
                size: constants_1.BACKGROUND_ICON_SIZE,
            },
            active: isMarkActive_1.default(schema.marks.background_green),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.GREEN_BACKGROUND_SHORTCUT,
                deviceType,
            }),
        },
        {
            name: "background_blue",
            tooltip: "Blue Background",
            icon: icons_1.CircleIcon,
            iconSVGProps: {
                r: constants_1.BACKGROUND_RADIUS,
                cx: constants_1.BACKGROUND_RADIUS,
                cy: constants_1.BACKGROUND_RADIUS,
                fill: schema.marks.background_blue.attrs.color.default,
                size: constants_1.BACKGROUND_ICON_SIZE,
            },
            active: isMarkActive_1.default(schema.marks.background_blue),
            visible: !isTemplate && !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.BLUE_BACKGROUND_SHORTCUT,
                deviceType,
            }),
        },
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
            visible: !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.BOLD_SHORTCUT2,
                deviceType,
            }),
        },
        {
            name: "underline",
            tooltip: dictionary.underline,
            icon: icons_1.UnderlineIcon,
            active: isMarkActive_1.default(schema.marks.underline),
            visible: !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.UNDERLINE_SHORTCUT2,
                deviceType,
            }),
        },
        {
            name: "em",
            tooltip: dictionary.em,
            icon: outline_icons_1.ItalicIcon,
            active: isMarkActive_1.default(schema.marks.em),
            visible: !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.ITALIC_SHORTCUT2,
                deviceType,
            }),
        },
        {
            name: "strikethrough",
            tooltip: dictionary.strikethrough,
            icon: outline_icons_1.StrikethroughIcon,
            active: isMarkActive_1.default(schema.marks.strikethrough),
            visible: !isSelectionEmpty,
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.STRIKETHROUGH_SHORTCUT2,
                deviceType,
            }),
        },
        {
            name: "code_inline",
            tooltip: dictionary.codeInline,
            icon: outline_icons_1.CodeIcon,
            active: isMarkActive_1.default(schema.marks.code_inline),
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.CODE_SHORTCUT2,
                deviceType,
            }),
        },
        {
            name: "separator",
            visible: !isSelectionEmpty,
        },
        organizeMenuItemByDefault({
            items: ALL_HIGHLIGHTS,
            name: defaultHighlight,
            orientation: 'left',
            tooltip: 'More Highlights',
            commands,
            setFn: setDefaultHighlight,
        }),
        organizeMenuItemByDefault({
            items: ALL_BACKGROUNDS,
            name: defaultBackground,
            orientation: 'right',
            tooltip: 'More Backgrounds',
            commands,
            setFn: setDefaultBackground,
        }),
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
            shortcut: parseShortcut_1.parseShortcut({
                shortcut: constants_1.LINK_SHORTCUT2,
                deviceType,
            }),
        },
    ];
}
exports.default = formattingMenuItems;
//# sourceMappingURL=formatting.js.map