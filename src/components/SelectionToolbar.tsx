import * as React from "react";
import { Portal } from "react-portal";
import some from "lodash/some";
import { EditorView } from "prosemirror-view";
import { TextSelection } from "prosemirror-state";
import getTableColMenuItems from "../menus/tableCol";
import getTableRowMenuItems from "../menus/tableRow";
import getTableMenuItems from "../menus/table";
import getFormattingMenuItems from "../menus/formatting";
import getImageMenuItems from "../menus/image";
import getDividerMenuItems from "../menus/divider";
import FloatingToolbar from "./FloatingToolbar";
import LinkEditor, { SearchResult } from "./LinkEditor";
import ToolbarMenu from "./ToolbarMenu";
import filterExcessSeparators from "../lib/filterExcessSeparators";
import isMarkActive from "../queries/isMarkActive";
import getMarkRange from "../queries/getMarkRange";
import isNodeActive from "../queries/isNodeActive";
import getColumnIndex from "../queries/getColumnIndex";
import getRowIndex from "../queries/getRowIndex";
import createAndInsertLink from "../commands/createAndInsertLink";
import { MenuItem, DeviceType, DefaultHighlight,
  DefaultBackground, SetDefaultHighlight,
  SetDefaultBackground } from "../types";
import baseDictionary from "../dictionary";
import { deleteRow, deleteColumn, deleteTable } from '@knowt/prosemirror-tables';

type Props = {
  dictionary: typeof baseDictionary;
  rtl: boolean;
  isTemplate: boolean;
  commands: Record<string, any>;
  onOpen: () => void;
  onClose: () => void;
  onSearchLink?: (term: string) => Promise<SearchResult[]>;
  onClickLink: (href: string, event: MouseEvent) => void;
  onCreateLink?: (title: string) => Promise<string>;
  onShowToast?: (msg: string, code: string) => void;
  view: EditorView;
  isDarkMode?: boolean;
  deviceType?: DeviceType;
  defaultHighlight?: DefaultHighlight;
  defaultBackground?: DefaultBackground;
  setDefaultHighlight?: SetDefaultHighlight;
  setDefaultBackground?: SetDefaultBackground;
};

type State = {
  isClient: boolean;
}

type HandleTableDeleteInput = {
  isTableRowSelected: boolean;
  isTableColSelected: boolean;
  isTableSelected: boolean;
}

function isVisible(props) {
  const { view } = props;
  const { selection } = view.state;

  if (!selection) return false;
  if (selection.empty) return false;
  if (selection.node && selection.node.type.name === "hr") {
    return true;
  }
  if (selection.node && selection.node.type.name === "image") {
    return true;
  }
  if (selection.node) return false;

  const slice = selection.content();
  const fragment = slice.content;
  const nodes = fragment.content;

  return some(nodes, (n) => n.content.size);
}

export default class SelectionToolbar extends React.Component<Props, State> {
  isActive = false;
  menuRef = React.createRef<HTMLDivElement>();
  isCutInProgress = false;
  isTableRowSelected = false;
  isTableColSelected = false;
  isTableSelected = false;

  state = {
    isClient: false,
  }

  componentDidUpdate(): void {
    const visible = isVisible(this.props);
    if (this.isActive && !visible) {
      this.isActive = false;
      this.props.onClose();
      // for some reason tracked selections are reset prior to a cut event
      // this makes sure we save selections until after cut event is complete
      if ( !this.isCutInProgress ) {
        this.resetTrackedSelections();
      }
    }
    if (!this.isActive && visible) {
      this.isActive = true;
      this.props.onOpen();
    }
  }

  componentDidMount(): void {
    window.addEventListener("mouseup", this.handleClickOutside);

    document.addEventListener( 'keydown', (event) => this.handleKeydown(event) );
    document.addEventListener( 'beforecut', () => this.handleBeforeCut() );
    document.addEventListener( 'cut', () => this.handleCut() );

    this.setState( ( state ) => ( {
      ...state,
      isClient: true,
    } ) )
  }

  componentWillUnmount(): void {
    window.removeEventListener("mouseup", this.handleClickOutside);

    document.removeEventListener( 'keydown', (event) => this.handleKeydown(event) );
    document.removeEventListener( 'beforecut', () => this.handleBeforeCut() );
    document.removeEventListener( 'cut', () => this.handleCut() );
  }

  handleBeforeCut(): void {
    this.isCutInProgress = true;
  }

  handleCut(): void {
    const { isTableRowSelected, isTableColSelected, isTableSelected } = this;

    this.handleTableDelete( {
      isTableRowSelected,
      isTableColSelected,
      isTableSelected
    } );

    this.isCutInProgress = false;
  }

  handleKeydown(event: KeyboardEvent): void {
    if ( event.key === 'Backspace' ) {
      const { isTableRowSelected, isTableColSelected, isTableSelected } = this;

      const didDelete = this.handleTableDelete( {
        isTableRowSelected,
        isTableColSelected,
        isTableSelected,
      } );

      if ( didDelete ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
  }

  handleTableDelete(input: HandleTableDeleteInput): boolean {
    const { isTableRowSelected, isTableColSelected, isTableSelected } = input;

    if ( isTableRowSelected ) {
      const { state, dispatch } = this.props.view;
      deleteRow(state, dispatch);

      return true;
    }
    else if ( isTableColSelected ) {
      const { state, dispatch } = this.props.view;
      deleteColumn(state, dispatch);

      return true;
    }
    else if ( isTableSelected ) {
      const { state, dispatch } = this.props.view;
      deleteTable(state, dispatch);
    }

    return false;
  }

  resetTrackedSelections(): void {
    this.isTableColSelected = false;
    this.isTableRowSelected = false;
    this.isTableSelected = false;
  }

  handleClickOutside = (ev: MouseEvent): void => {
    if (
      ev.target instanceof Node &&
      this.menuRef.current &&
      this.menuRef.current.contains(ev.target)
    ) {
      return;
    }

    if (!this.isActive) {
      return;
    }

    const { view } = this.props;
    if (view.hasFocus()) {
      return;
    }

    const { dispatch } = view;

    dispatch(
      view.state.tr.setSelection(new TextSelection(view.state.doc.resolve(0)))
    );
  };

  handleOnCreateLink = async (title: string): Promise<void> => {
    const { dictionary, onCreateLink, view, onShowToast } = this.props;

    if (!onCreateLink) {
      return;
    }

    const { dispatch, state } = view;
    const { from, to } = state.selection;
    if (from === to) {
      // selection cannot be collapsed
      return;
    }

    const href = `creating#${title}…`;
    const markType = state.schema.marks.link;

    // Insert a placeholder link
    dispatch(
      view.state.tr
        .removeMark(from, to, markType)
        .addMark(from, to, markType.create({ href }))
    );

    createAndInsertLink(view, title, href, {
      onCreateLink,
      onShowToast,
      dictionary,
    });
  };

  handleOnSelectLink = ({
    href,
    from,
    to,
  }: {
    href: string;
    from: number;
    to: number;
  }): void => {
    const { view } = this.props;
    const { state, dispatch } = view;

    const markType = state.schema.marks.link;

    dispatch(
      state.tr
        .removeMark(from, to, markType)
        .addMark(from, to, markType.create({ href }))
    );
  };

  render() {
    const { dictionary, 
      onCreateLink, 
      isTemplate, 
      rtl, 
      deviceType,
      defaultBackground,
      defaultHighlight,
      setDefaultBackground,
      setDefaultHighlight, 
      ...rest } = this.props;
    const { view } = rest;
    const { state } = view;
    const { selection }: { selection: any } = state;
    const isCodeSelection = isNodeActive(state.schema.nodes.code_block)(state);
    const isDividerSelection = isNodeActive(state.schema.nodes.hr)(state);

    // toolbar is disabled in code blocks, no bold / italic etc
    if (isCodeSelection) {
      return null;
    }

    const colIndex = getColumnIndex(state.selection);
    const rowIndex = getRowIndex(state.selection);
    const isTableSelection = colIndex !== undefined && rowIndex !== undefined;
    const link = isMarkActive(state.schema.marks.link)(state);
    const range = getMarkRange(selection.$from, state.schema.marks.link);
    const isImageSelection =
      selection.node && selection.node.type.name === "image";
    let isTextSelection = false;

    let items: MenuItem[] = [];
    if (
      isTableSelection &&
      typeof rowIndex === 'number'
    ) {
      items = getTableMenuItems(dictionary, {
        rowIndex,
        rtl,
      });
      this.resetTrackedSelections();
      this.isTableSelected = true;
    } else if (colIndex !== undefined) {
      items = getTableColMenuItems(state, colIndex, rtl, dictionary);
      this.resetTrackedSelections();
      this.isTableColSelected = true;
    } else if (rowIndex !== undefined) {
      items = getTableRowMenuItems(state, rowIndex, dictionary);
      this.resetTrackedSelections();
      this.isTableRowSelected = true;
    } else if (isImageSelection) {
      items = getImageMenuItems(state, dictionary);
    } else if (isDividerSelection) {
      items = getDividerMenuItems(state, dictionary);
    } else {
      items = getFormattingMenuItems( {
        view,
        isTemplate,
        dictionary,
        deviceType,
        defaultHighlight,
        defaultBackground,
        setDefaultBackground,
        setDefaultHighlight,
        commands: this.props.commands,
      } );

      isTextSelection = true;
    }

    // Some extensions may be disabled, remove corresponding items
    items = items.filter((item) => {
      if (item.name === "separator") return true;
      if (item.name && !item.customOnClick && !this.props.commands[item.name])
        return false;
      return true;
    });

    items = filterExcessSeparators(items);
    if (!items.length) {
      return null;
    }

    const selectionText = state.doc.cut(
      state.selection.from,
      state.selection.to
    ).textContent;

    if (isTextSelection && !selectionText) {
      return null;
    }

    return (
      <>
      {
        this.state.isClient ? (
          <Portal>
            <FloatingToolbar
              view={view}
              active={isVisible(this.props)}
              ref={this.menuRef}
            >
              {link && range ? (
                <LinkEditor
                  dictionary={dictionary}
                  mark={range.mark}
                  from={range.from}
                  to={range.to}
                  onCreateLink={onCreateLink ? this.handleOnCreateLink : undefined}
                  onSelectLink={this.handleOnSelectLink}
                  {...rest}
                />
              ) : (
                <ToolbarMenu items={items} {...rest} />
              )}
            </FloatingToolbar>
          </Portal>
        ) : ''
      }
      </>
    );
  }
}
