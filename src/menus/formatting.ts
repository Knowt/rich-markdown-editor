import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
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
import isMarkActive, { isAnyMarkActive } from "../queries/isMarkActive";
import isNodeActive from "../queries/isNodeActive";
import { MenuItem } from "../types";
import baseDictionary from "../dictionary";
import removeMarks from "../commands/removeMarks";
import { RemoveIcon } from "../icons";
import { EditorView } from "prosemirror-view";
import _isSelectionEmpty from "../queries/isSelectionEmpty";

export default function formattingMenuItems(
  view: EditorView,
  isTemplate: boolean,
  dictionary: typeof baseDictionary
): MenuItem[] {
  const { state } = view;
  const { schema, selection } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);
  const isSelectionEmpty = _isSelectionEmpty(selection);

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
    },
    {
      name: "strikethrough",
      tooltip: dictionary.strikethrough,
      icon: StrikethroughIcon,
      active: isMarkActive(schema.marks.strikethrough),
      visible: !isSelectionEmpty,
    },
    {
      name: "separator",
      visible: allowBlocks && !isSelectionEmpty,
    },
    {
      name: "highlight_default",
      tooltip: "Red Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_default.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_default),
      visible: !isTemplate && !isSelectionEmpty,
    },
    {
      name: "highlight_orange",
      tooltip: "Orange Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_orange.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_orange),
      visible: !isTemplate && !isSelectionEmpty,
    },
    {
      name: "highlight_yellow",
      tooltip: "Yellow Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_yellow.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_yellow),
      visible: !isTemplate && !isSelectionEmpty,
    },
    {
      name: "highlight_green",
      tooltip: "Green Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_green.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_green),
      visible: !isTemplate && !isSelectionEmpty,
    },
    {
      name: "highlight_blue",
      tooltip: "Blue Highlight",
      icon: HighlightIcon,
      iconColor: schema.marks.highlight_blue.attrs.color.default,
      active: isMarkActive(schema.marks.highlight_blue),
      visible: !isTemplate && !isSelectionEmpty,
    },
    {
      name: "highlight_remove",
      tooltip: "Remove All Highlights",
      icon: RemoveIcon,
      iconColor: "#fff",
      active: isAnyMarkActive(allMarks),
      visible: !isTemplate && !isSelectionEmpty,
      customOnClick: () => removeMarks(view, allMarks),
    },
    {
      name: "separator",
      visible: allowBlocks && !isSelectionEmpty,
    },
    {
      name: "code_inline",
      tooltip: dictionary.codeInline,
      icon: CodeIcon,
      active: isMarkActive(schema.marks.code_inline),
    },
    {
      name: "separator",
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: dictionary.heading,
      icon: Heading1Icon,
      active: isNodeActive(schema.nodes.heading, { level: 1 }),
      attrs: { level: 1 },
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: dictionary.subheading,
      icon: Heading2Icon,
      active: isNodeActive(schema.nodes.heading, { level: 2 }),
      attrs: { level: 2 },
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
      visible: allowBlocks || isList,
    },
    {
      name: "checkbox_list",
      tooltip: dictionary.checkboxList,
      icon: TodoListIcon,
      keywords: "checklist checkbox task",
      active: isNodeActive(schema.nodes.checkbox_list),
      visible: allowBlocks || isList,
    },
    {
      name: "bullet_list",
      tooltip: dictionary.bulletList,
      icon: BulletedListIcon,
      active: isNodeActive(schema.nodes.bullet_list),
      visible: allowBlocks || isList,
    },
    {
      name: "ordered_list",
      tooltip: dictionary.orderedList,
      icon: OrderedListIcon,
      active: isNodeActive(schema.nodes.ordered_list),
      visible: allowBlocks || isList,
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
    },
  ];
}
