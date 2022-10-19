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
import { isInTable } from "@knowt/prosemirror-tables";
import isInList from "../queries/isInList";
import isMarkActive from "../queries/isMarkActive";
import isNodeActive from "../queries/isNodeActive";
import { MenuItem } from "../types";
import baseDictionary from "../dictionary";
import { EditorView } from "prosemirror-view";
import _isSelectionEmpty from "../queries/isSelectionEmpty";
import isHeading from '../queries/isHeading';
import { parseShortcut } from '../lib/parseShortcut';
import { BOLD_SHORTCUT2, STRIKETHROUGH_SHORTCUT2,
  CODE_SHORTCUT, BLUE_HIGHLIGHT_SHORTCUT, 
  YELLOW_HIGHLIGHT_SHORTCUT, LINK_SHORTCUT2 } from '../lib/constants';

export default function formattingMenuItems(
  view: EditorView,
  isTemplate: boolean,
  dictionary: typeof baseDictionary,
): MenuItem[] {
  const { state } = view;
  const { schema, selection } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);
  const isSelectionEmpty = _isSelectionEmpty(selection);
  const isSelHeading = isHeading( state );

  const allowBlocks = !isTable && !isList;

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
      } ),
    },
    {
      name: "strikethrough",
      tooltip: dictionary.strikethrough,
      icon: StrikethroughIcon,
      active: isMarkActive(schema.marks.strikethrough),
      visible: !isSelectionEmpty,
      shortcut: parseShortcut( { 
        shortcut: STRIKETHROUGH_SHORTCUT2,
      } ),
    },
    {
      name: "code_inline",
      tooltip: dictionary.codeInline,
      icon: CodeIcon,
      active: isMarkActive(schema.marks.code_inline),
      shortcut: parseShortcut( { 
        shortcut: CODE_SHORTCUT,
      } ),
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
      shortcut: parseShortcut( { 
        shortcut: BLUE_HIGHLIGHT_SHORTCUT,
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
      } ),
    },
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
      } ),
    },
  ];
}
