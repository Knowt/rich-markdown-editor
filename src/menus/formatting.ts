import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  BlockQuoteIcon,
  LinkIcon,
  StrikethroughIcon,
  OrderedListIcon,
  BulletedListIcon,
  TodoListIcon,
  InputIcon,
  HighlightIcon,
} from "outline-icons";
import { CircleIcon } from '../icons';
import { isInTable } from "@knowt/prosemirror-tables";
import isInList from "../queries/isInList";
import isMarkActive from "../queries/isMarkActive";
import isNodeActive from "../queries/isNodeActive";
import { MenuItem, DeviceType, DefaultHighlight,
  DefaultBackground, SetDefaultBackground,
  SetDefaultHighlight } from "../types";
import baseDictionary from "../dictionary";
import { EditorView } from "prosemirror-view";
import _isSelectionEmpty from "../queries/isSelectionEmpty";
import { toggleMark } from '../commands/toggleMark';
import isHeading from '../queries/isHeading';

export default function formattingMenuItems( 
  input: FormattingMenuItemsInput,
): MenuItem[] {
  const { view, 
    isTemplate, 
    dictionary, 
    deviceType,
    commands,
    defaultHighlight=DEFAULT_HIGHLIGHT,
    defaultBackground=DEFAULT_BACKGROUND,
    setDefaultBackground,
    setDefaultHighlight, } = input;
  const { state } = view;
  const { schema, selection } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);
  const isSelectionEmpty = _isSelectionEmpty(selection);
  const isSelHeading = isHeading( state );

  const allowBlocks = !isTable && !isList;

  const ALL_HIGHLIGHTS: MenuItem[] = [
    {
      name: "highlight_red",
      tooltip: "Red Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_red.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_red),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: ORANGE_HIGHLIGHT_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "highlight_orange",
      tooltip: "Orange Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_orange.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_orange),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: BLUE_HIGHLIGHT_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "highlight_yellow",
      tooltip: "Yellow Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_yellow.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_yellow),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: YELLOW_HIGHLIGHT_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "highlight_green",
      tooltip: "Green Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_green.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_green),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: GREEN_HIGHLIGHT_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "highlight_blue",
      tooltip: "Blue Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_blue.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_blue),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: BLUE_HIGHLIGHT_SHORTCUT,
        deviceType,
      } ),
    },
  ];

  const ALL_BACKGROUNDS: MenuItem[] = [
    {
      name: "background_red",
      tooltip: "Red Background",
      icon: CircleIcon,
      iconSVGProps: {
        r: BACKGROUND_RADIUS,
        cx: BACKGROUND_RADIUS,
        cy: BACKGROUND_RADIUS,
        fill: schema.marks.background_red.attrs.color.default,
        size: BACKGROUND_ICON_SIZE,
      },
      active: isMarkActive(schema.marks.background_red),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: RED_BACKGROUND_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "background_orange",
      tooltip: "Orange Background",
      icon: CircleIcon,
      iconSVGProps: {
        r: BACKGROUND_RADIUS,
        cx: BACKGROUND_RADIUS,
        cy: BACKGROUND_RADIUS,
        fill: schema.marks.background_orange.attrs.color.default,
        size: BACKGROUND_ICON_SIZE,
      },
      active: isMarkActive(schema.marks.background_orange),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: ORANGE_BACKGROUND_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "background_yellow",
      tooltip: "Yellow Background",
      icon: CircleIcon,
      iconSVGProps: {
        r: BACKGROUND_RADIUS,
        cx: BACKGROUND_RADIUS,
        cy: BACKGROUND_RADIUS,
        fill: schema.marks.background_yellow.attrs.color.default,
        size: BACKGROUND_ICON_SIZE,
      },
      active: isMarkActive(schema.marks.background_yellow),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: YELLOW_BACKGROUND_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "background_green",
      tooltip: "Green Background",
      icon: CircleIcon,
      iconSVGProps: {
        r: BACKGROUND_RADIUS,
        cx: BACKGROUND_RADIUS,
        cy: BACKGROUND_RADIUS,
        fill: schema.marks.background_green.attrs.color.default,
        size: BACKGROUND_ICON_SIZE,
      },
      active: isMarkActive(schema.marks.background_green),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: GREEN_BACKGROUND_SHORTCUT,
        deviceType,
      } ),
    },
    {
      name: "background_blue",
      tooltip: "Blue Background",
      icon: CircleIcon,
      iconSVGProps: {
        r: BACKGROUND_RADIUS,
        cx: BACKGROUND_RADIUS,
        cy: BACKGROUND_RADIUS,
        fill: schema.marks.background_blue.attrs.color.default,
        size: BACKGROUND_ICON_SIZE,
      },
      active: isMarkActive(schema.marks.background_blue),
      visible: !isTemplate && !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: BLUE_BACKGROUND_SHORTCUT,
        deviceType,
      } ),
    },
  ];

  return [
    {
      name: "placeholder",
      tooltip: dictionary.placeholder,
      icon: InputIcon,
      active: isMarkActive(schema.marks.placeholder),
      visible: isTemplate,
    },
    {
      name: "separator",
      visible: isTemplate,
    },
    {
      name: "strong",
      tooltip: dictionary.strong,
      icon: BoldIcon,
      active: isMarkActive(schema.marks.strong),
      visible: !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: BOLD_SHORTCUT2,
        deviceType,
      } ),
    },
    {
      name: "strikethrough",
      tooltip: dictionary.strikethrough,
      icon: StrikethroughIcon,
      active: isMarkActive(schema.marks.strikethrough),
      visible: !isSelectionEmpty,
    },
    {
      name: "code_inline",
      tooltip: dictionary.codeInline,
      icon: CodeIcon,
      active: isMarkActive(schema.marks.code_inline),
    },
    {
      name: "separator",
      visible: !isSelectionEmpty,
    },
    {
      name: "highlight_blue",
      tooltip: "Blue Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_blue.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_blue),
      visible: !isTemplate && !isSelectionEmpty,
      customOnClick: () => toggleMark( {
        item: schema.marks.highlight_blue,
        commands,
        isMarkActive: isMarkActive(schema.marks.highlight_blue),
        view,
        allMarks,
      } ),
    },
    {
      name: "highlight_yellow",
      tooltip: "Yellow Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_yellow.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_yellow),
      visible: !isTemplate && !isSelectionEmpty,
      customOnClick: () => toggleMark( {
        item: schema.marks.highlight_yellow,
        commands,
        isMarkActive: isMarkActive(schema.marks.highlight_yellow),
        view,
        allMarks,
      } ),
    },
    // {
    //   name: "highlight_green",
    //   tooltip: "Green Highlight",
    //   icon: HighlightIcon,
    //   iconColor: schema.marks.highlight_green.attrs.color.default,
    //   active: isMarkActive(schema.marks.highlight_green),
    //   visible: !isTemplate && !isSelectionEmpty,
    //   customOnClick: () => toggleMark( {
    //     item: schema.marks.highlight_green,
    //     commands,
    //     isMarkActive: isMarkActive(schema.marks.highlight_green),
    //     view,
    //     allMarks,
    //   } ),
    // },
    // {
    //   name: "highlight_remove",
    //   tooltip: "Remove All Highlights",
    //   icon: RemoveIcon,
    //   iconColor: "#fff",
    //   active: isAnyMarkActive(allMarks),
    //   visible: !isTemplate && !isSelectionEmpty,
    //   customOnClick: () => removeMarks(view, allMarks),
    // },
    // {
    //   name: "highlight_default",
    //   tooltip: "Red Highlight",
    //   icon: HighlightIcon,
    //   iconColor: schema.marks.highlight_default.attrs.color.default,
    //   active: isMarkActive(schema.marks.highlight_default),
    //   visible: !isTemplate && !isSelectionEmpty,
    //   customOnClick: () => toggleMark( {
    //     item: schema.marks.highlight_default,
    //     commands,
    //     isMarkActive: isMarkActive(schema.marks.highlight_default),
    //     view,
    //     allMarks,
    //   } ),
    // },
    // {
    //   name: "highlight_orange",
    //   tooltip: "Orange Highlight",
    //   icon: HighlightIcon,
    //   iconColor: schema.marks.highlight_orange.attrs.color.default,
    //   active: isMarkActive(schema.marks.highlight_orange),
    //   visible: !isTemplate && !isSelectionEmpty,
    //   customOnClick: () => toggleMark( {
    //     item: schema.marks.highlight_orange,
    //     commands,
    //     isMarkActive: isMarkActive(schema.marks.highlight_orange),
    //     view,
    //     allMarks,
    //   } ),
    // },
    {
      name: "separator",
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: dictionary.h1,
      icon: Heading1Icon,
      active: isNodeActive(schema.nodes.heading, { level: 1 }),
      attrs: { level: 1 },
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: dictionary.h2,
      icon: Heading2Icon,
      active: isNodeActive(schema.nodes.heading, { level: 2 }),
      attrs: { level: 2 },
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: dictionary.h3,
      icon: Heading3Icon,
      active: isNodeActive(schema.nodes.heading, { level: 3 }),
      attrs: { level: 3 },
      visible: allowBlocks,
    },
    {
      name: "blockquote",
      tooltip: dictionary.quote,
      icon: BlockQuoteIcon,
      active: isNodeActive(schema.nodes.blockquote),
      attrs: { level: 2 },
      visible: allowBlocks,
    },
    {
      name: "separator",
      visible: ( allowBlocks || isList ) && !isSelHeading,
    },
    {
      name: "checkbox_list",
      tooltip: dictionary.checkboxList,
      icon: TodoListIcon,
      keywords: "checklist checkbox task",
      active: isNodeActive(schema.nodes.checkbox_list),
      visible: ( allowBlocks || isList ) && !isSelHeading,
    },
    {
      name: "bullet_list",
      tooltip: dictionary.bulletList,
      icon: BulletedListIcon,
      active: isNodeActive(schema.nodes.bullet_list),
      visible: ( allowBlocks || isList ) && !isSelHeading,
    },
    {
      name: "ordered_list",
      tooltip: dictionary.orderedList,
      icon: OrderedListIcon,
      active: isNodeActive(schema.nodes.ordered_list),
      visible: ( allowBlocks || isList ) && !isSelHeading,
    },
    {
      name: "separator",
    },
    {
      name: "link",
      tooltip: dictionary.createLink,
      icon: LinkIcon,
      active: isMarkActive(schema.marks.link),
      attrs: { href: "" },
      shortcut: parseShortcut( { 
        shortcut: LINK_SHORTCUT2,
        deviceType,
      } ),
    },
  ];
}
