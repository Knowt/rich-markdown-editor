import { wrappingInputRule } from "prosemirror-inputrules";
import Node from "./Node";
import toggleWrap from "../commands/toggleWrap";
import isNodeActive from "../queries/isNodeActive";
import { EditorState } from 'prosemirror-state';
import { findParentNode, replaceParentNodeOfType } from '@knowt/prosemirror-utils';

export default class Blockquote extends Node {
  get name() {
    return "blockquote";
  }

  get schema() {
    return {
      content: "block+",
      group: "block",
      defining: true,
      parseDOM: [{ tag: "blockquote" }],
      toDOM: () => ["blockquote", 0],
    };
  }

  inputRules({ type }) {
    return [wrappingInputRule(/^\s*>\s$/, type)];
  }

  commands({ type }) {
    return () => toggleWrap(type);
  }

  keys({ type }) {
    return {
      "Ctrl->": toggleWrap(type),
      "Mod-]": toggleWrap(type),
      "Shift-Enter": (state, dispatch) => {
        if (!isNodeActive(type)(state)) {
          return false;
        }

        const { tr, selection } = state;
        dispatch(tr.split(selection.to));
        return true;
      },
      Backspace: (state: EditorState, dispatch) => {
        // TODO - this is a temp solution.
        // For some reason having a table as a prior node messed up quote deletion.
        const parentQuote = findParentNode((node) => node.type.name === 'blockquote')(
          state.selection
        );

        if ( parentQuote && !parentQuote.node.textContent ) {
          const p = state.schema.nodes.paragraph.create();

          dispatch(
            replaceParentNodeOfType( parentQuote.node.type, p )(state.tr),
          );
          
          return true;
        }
      },
    };
  }

  toMarkdown(state, node) {
    state.wrapBlock("> ", null, node, () => state.renderContent(node));
  }

  parseMarkdown() {
    return { block: "blockquote" };
  }
}
