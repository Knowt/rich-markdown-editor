"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedsGroup = exports.getGroupedMenuItems = void 0;
const outline_icons_1 = require("outline-icons");
const icons_1 = require("../icons");
const removeMarks_1 = __importDefault(require("../commands/removeMarks"));
const constants_1 = require("../lib/constants");
const getGroupedMenuItems = (view, dictionary, deviceType) => {
    const { state } = view;
    const { schema } = state;
    const mod = deviceType === 'mac' ? '⌘' : 'ctrl';
    const allMarks = [
        schema.marks.highlight_red,
        schema.marks.highlight_orange,
        schema.marks.highlight_yellow,
        schema.marks.highlight_green,
        schema.marks.highlight_blue,
    ];
    return [
        {
            groupData: {
                name: "Headers",
            },
            items: [
                {
                    name: "heading",
                    title: dictionary.h1,
                    keywords: "h1 heading1 title",
                    searchKeyword: "h1",
                    icon: outline_icons_1.Heading1Icon,
                    shortcut: "^ ⇧ 1",
                    attrs: { level: 1 },
                },
                {
                    name: "heading",
                    title: dictionary.h2,
                    keywords: "h2 heading2",
                    searchKeyword: "h2",
                    icon: outline_icons_1.Heading2Icon,
                    shortcut: "^ ⇧ 2",
                    attrs: { level: 2 },
                },
                {
                    name: "heading",
                    title: dictionary.h3,
                    keywords: "h3 heading3",
                    searchKeyword: "h3",
                    icon: outline_icons_1.Heading3Icon,
                    shortcut: "^ ⇧ 3",
                    attrs: { level: 3 },
                },
            ],
        },
        {
            groupData: {
                name: "Lists",
            },
            items: [
                {
                    name: "checkbox_list",
                    title: dictionary.checkboxList,
                    icon: outline_icons_1.TodoListIcon,
                    keywords: "checklist checkbox task",
                    searchKeyword: "todo",
                    shortcut: "^ ⇧ 7",
                },
                {
                    name: "bullet_list",
                    title: dictionary.bulletList,
                    icon: outline_icons_1.BulletedListIcon,
                    keywords: "bullet list",
                    searchKeyword: "bullet",
                    shortcut: "^ ⇧ 8",
                },
                {
                    name: "ordered_list",
                    title: dictionary.orderedList,
                    icon: outline_icons_1.OrderedListIcon,
                    keywords: "ordered numbered list",
                    searchKeyword: "number",
                    shortcut: "^ ⇧ 9",
                },
            ],
        },
        {
            groupData: {
                name: "Insert",
            },
            items: [
                {
                    name: "image",
                    title: dictionary.image,
                    icon: outline_icons_1.ImageIcon,
                    searchKeyword: "image",
                    keywords: "picture photo",
                },
                {
                    name: "table",
                    title: dictionary.table,
                    icon: outline_icons_1.TableIcon,
                    searchKeyword: "table",
                    attrs: { rowsCount: 3, colsCount: 3 },
                },
                {
                    name: "blockquote",
                    title: dictionary.quote,
                    icon: outline_icons_1.BlockQuoteIcon,
                    searchKeyword: "quote",
                    shortcut: `${mod} ]`,
                },
                {
                    name: "code_block",
                    title: dictionary.codeBlock,
                    icon: outline_icons_1.CodeIcon,
                    shortcut: "^ ⇧ \\",
                    keywords: "script code",
                    searchKeyword: "code",
                },
                {
                    name: "hr",
                    title: dictionary.hr,
                    icon: outline_icons_1.HorizontalRuleIcon,
                    shortcut: `${mod} _`,
                    keywords: "horizontal rule break line",
                    searchKeyword: "divider",
                },
                {
                    name: "link",
                    title: dictionary.link,
                    icon: outline_icons_1.LinkIcon,
                    shortcut: `${mod} k`,
                    keywords: "link url uri href",
                    searchKeyword: "link",
                },
            ],
        },
        {
            groupData: {
                name: "Highlight",
            },
            items: [
                {
                    name: "highlight_red",
                    title: "Red",
                    icon: outline_icons_1.HighlightIcon,
                    iconColor: schema.marks.highlight_red.attrs.color.default,
                    keywords: "highlight red",
                    searchKeyword: "red",
                    shortcut: "alt shift 1",
                },
                {
                    name: "highlight_orange",
                    title: "Orange",
                    icon: outline_icons_1.HighlightIcon,
                    iconColor: schema.marks.highlight_orange.attrs.color.default,
                    keywords: "highlight orange",
                    searchKeyword: "orange",
                    shortcut: "alt shift 2",
                },
                {
                    name: "highlight_yellow",
                    title: "Yellow",
                    icon: outline_icons_1.HighlightIcon,
                    iconColor: schema.marks.highlight_yellow.attrs.color.default,
                    keywords: "highlight yellow",
                    searchKeyword: "yellow",
                    shortcut: "alt shift 3",
                },
                {
                    name: "highlight_green",
                    title: "Green",
                    icon: outline_icons_1.HighlightIcon,
                    iconColor: schema.marks.highlight_green.attrs.color.default,
                    keywords: "highlight green",
                    searchKeyword: "green",
                    shortcut: "alt shift 4",
                },
                {
                    name: "highlight_blue",
                    title: "Blue",
                    icon: outline_icons_1.HighlightIcon,
                    iconColor: schema.marks.highlight_blue.attrs.color.default,
                    keywords: "highlight blue",
                    searchKeyword: "blue",
                    shortcut: "alt shift 5",
                },
                {
                    name: "highlight_remove",
                    title: "No highlight",
                    icon: icons_1.CircleIcon,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS - 1,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                        strokeWidth: 1,
                        fill: "#fff",
                        stroke: "#777",
                    },
                    keywords: "highlight remove unhighlight",
                    searchKeyword: "unhighlight",
                    shortcut: "",
                    customOnClick: () => removeMarks_1.default(view, allMarks),
                },
            ],
        },
        {
            groupData: {
                name: "Background",
            },
            items: [
                {
                    name: "background_red",
                    title: "Red",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.background_red.attrs.color.default,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                    },
                    keywords: "background red",
                    searchKeyword: "red",
                    shortcut: "alt shift 6",
                },
                {
                    name: "background_orange",
                    title: "Orange",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.background_orange.attrs.color.default,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                    },
                    keywords: "background orange",
                    searchKeyword: "orange",
                    shortcut: "alt shift 7",
                },
                {
                    name: "background_yellow",
                    title: "Yellow",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.background_yellow.attrs.color.default,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                    },
                    keywords: "background yellow",
                    searchKeyword: "yellow",
                    shortcut: "alt shift 8",
                },
                {
                    name: "background_green",
                    title: "Green",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.background_green.attrs.color.default,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                    },
                    keywords: "background green",
                    searchKeyword: "green",
                    shortcut: "alt shift 9",
                },
                {
                    name: "background_blue",
                    title: "Blue",
                    icon: icons_1.CircleIcon,
                    iconColor: schema.marks.background_blue.attrs.color.default,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                    },
                    keywords: "background blue",
                    searchKeyword: "blue",
                    shortcut: "alt shift 0",
                },
                {
                    name: "background_remove",
                    title: "No Background",
                    icon: icons_1.CircleIcon,
                    iconSVGProps: {
                        r: constants_1.BACKGROUND_RADIUS - 1,
                        cx: constants_1.BACKGROUND_RADIUS,
                        cy: constants_1.BACKGROUND_RADIUS,
                        strokeWidth: 1,
                        fill: "#fff",
                        stroke: "#777",
                    },
                    keywords: "background remove unbackground",
                    searchKeyword: "unbackground",
                    shortcut: "",
                    customOnClick: () => removeMarks_1.default(view, allMarks),
                },
            ],
        },
    ];
};
exports.getGroupedMenuItems = getGroupedMenuItems;
const getEmbedsGroup = (embeds) => {
    const embedItems = [];
    for (const embed of embeds) {
        if (embed.title && embed.icon) {
            embedItems.push(Object.assign(Object.assign({}, embed), { name: "embed" }));
        }
    }
    return {
        groupData: { name: "Other" },
        items: embedItems,
    };
};
exports.getEmbedsGroup = getEmbedsGroup;
//# sourceMappingURL=block.js.map