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
import isHeading from '../queries/isHeading';
import { parseShortcut } from '../lib/parseShortcut';
import { BOLD_SHORTCUT2, STRIKETHROUGH_SHORTCUT2,
  CODE_SHORTCUT2, BLUE_HIGHLIGHT_SHORTCUT, 
  YELLOW_HIGHLIGHT_SHORTCUT, LINK_SHORTCUT2, 
  ORANGE_HIGHLIGHT_SHORTCUT, GREEN_HIGHLIGHT_SHORTCUT, 
  ORANGE_BACKGROUND_SHORTCUT, RED_BACKGROUND_SHORTCUT, 
  YELLOW_BACKGROUND_SHORTCUT, GREEN_BACKGROUND_SHORTCUT, 
  BLUE_BACKGROUND_SHORTCUT, BACKGROUND_RADIUS,
  BACKGROUND_ICON_SIZE } from '../lib/constants';

/* TYPES */
interface FormattingMenuItemsInput {
  view: EditorView;
  isTemplate: boolean;
  dictionary: typeof baseDictionary;
  deviceType?: DeviceType,
  commands: Record<string, any>;
  defaultHighlight?: DefaultHighlight;
  defaultBackground?: DefaultBackground;
  setDefaultHighlight?: SetDefaultHighlight;
  setDefaultBackground?: SetDefaultBackground;
}

interface OrganizeMenuItemsInput<T extends string> {
  items: MenuItem[];
  name: T;
  orientation: 'left' | 'right';
  tooltip?: string;
  commands: Record<string, any>;
  setFn?: ( input: T ) => void;
}

const organizeMenuItemByDefault = <T extends string = string>(
  input: OrganizeMenuItemsInput<T>,
) => {
  const { items, name, orientation, setFn, commands, tooltip } = input;

  let organizedItem: MenuItem = {};
  const subItems: MenuItem[] = [];

  const handleMenuItemCustomOnClick = <T extends string = string>(
    name: T,
    setFn?: ( input: T ) => void,
  ) => {
    commands[ name ]();
    setFn && setFn( name );
  }

  const addCustomOnClickToSubMenuItems = (
    items: MenuItem[],
  ) => {
    return items.map( ( item ) => ( { 
      ...item,
      tooltip: item.tooltip?.split( ' ' )[0],
      customOnClick: () => handleMenuItemCustomOnClick( 
        item.name as string,
        setFn,
      ),
    } ) );
  } 

  for ( let i=0; i < items.length; i++ ) {
    const item = items[i];

    if ( item.name === name ) {
      const nextIndex = i + 1;

      organizedItem = {
        ...item,
        subItems: {
          orientation,
          tooltip,
          items: nextIndex < items.length ? 
            [ 
              ...addCustomOnClickToSubMenuItems( subItems ), 
              ...addCustomOnClickToSubMenuItems( items.slice( nextIndex ) ),
            ] :
            addCustomOnClickToSubMenuItems( subItems ),
        }
      }

      break;
    }
    else {
      subItems.push( {
        ...item,
        tooltip: item.tooltip?.split( ' ' )[0],
        customOnClick: () => handleMenuItemCustomOnClick( 
          item.name as string,
          setFn,
        ),
      } );
    }
  }

  return organizedItem;
}

export default function formattingMenuItems( 
  input: FormattingMenuItemsInput,
): MenuItem[] {
  const { view, 
    isTemplate, 
    dictionary, 
    deviceType,
    commands,
    defaultHighlight='highlight_red',
    defaultBackground='background_blue',
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
      shortcut: parseShortcut( { 
        shortcut: STRIKETHROUGH_SHORTCUT2,
        deviceType,
      } ),
    },
    {
      name: "code_inline",
      tooltip: dictionary.codeInline,
      icon: CodeIcon,
      active: isMarkActive(schema.marks.code_inline),
      shortcut: parseShortcut( { 
        shortcut: CODE_SHORTCUT2,
        deviceType,
      } ),
    },
    {
      name: "separator",
      visible: !isSelectionEmpty,
    },
    // highlight
    organizeMenuItemByDefault( {
      items: ALL_HIGHLIGHTS,
      name: defaultHighlight,
      orientation: 'left',
      tooltip: 'More Highlights',
      commands,
      setFn: setDefaultHighlight,
    } ),
    // background
    organizeMenuItemByDefault( {
      items: ALL_BACKGROUNDS,
      name: defaultBackground,
      orientation: 'right',
      tooltip: 'More Backgrounds',
      commands,
      setFn: setDefaultBackground,
    } ),
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
