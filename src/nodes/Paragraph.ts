import { setBlockType } from "prosemirror-commands";
import Node from "./Node";
import { EditorState, TextSelection } from 'prosemirror-state';
import { findParentNodeClosestToPos, findParentNode } from '@knowt/prosemirror-utils';
import { isParentParagraph } from '../queries/isParentParagraph';
// import { isInTable } from "@knowt/prosemirror-tables";
// import isNodeActive from '../queries/isNodeActive';
// import isInList from "../queries/isInList";

export default class Paragraph extends Node {
  get name() {
    return "paragraph";
  }

  get schema() {
    return {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    };
  }

  keys({ type }) {
    return {
      "Shift-Ctrl-0": setBlockType(type),
      Backspace: (state: EditorState, dispatch) => {
        if ( isParentParagraph( state ) ) {
          const { selection, tr, doc } = state;
  
          const parentParagraph = findParentNode( ( node ) => node.type.name === 'paragraph' )(
            selection
          );
  
          if (
            parentParagraph &&
            selection.from === selection.to &&
            parentParagraph.start === selection.from
          ) {
            // brings backspaced content from a paragraph into the last cell of a table
            const tablePos = selection.from - 2;
            const paragraphText = parentParagraph.node.textContent;
    
            const prevTable = findParentNodeClosestToPos( 
              doc.resolve( tablePos ), 
              ( node ) => node.type.name === 'table',
            );
  
            if ( prevTable ) {
              const handleDispatch = ( rangeEnd: number=0 ) => {
                const lastCellPos = tablePos - 3;
                
                dispatch(
                  tr.deleteRange(
                    selection.from,
                    selection.from + paragraphText.length + rangeEnd,
                  )
                  .insertText( paragraphText, lastCellPos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( lastCellPos )
                  ) )
                );
              }

              try {
                // +2 handles deletion of line
                handleDispatch( 2 );
              }
              catch {
                // edge case for if writing on bottom of doc and there is no line to delete
                handleDispatch();
              }

              return true;
            }
          }
        }
      },
      // Tab: ( state: EditorState, dispatch ) => {
      //   if ( 
      //     isInTable( state ) ||
      //     isNodeActive(state.schema.nodes.image)(state) ||
      //     isNodeActive(state.schema.nodes.hr)(state) ||
      //     isInList(state)
      //   )
      //     return;

      //   const { tr } = state;
      //   tr.insertText( '    ' );
      //   dispatch( tr );
      // }
    };
  }

  commands({ type }) {
    return () => setBlockType(type);
  }

  toMarkdown(state, node) {
    // render empty paragraphs as hard breaks to ensure that newlines are
    // persisted between reloads (this breaks from markdown tradition)
    if (
      node.textContent.trim() === "" &&
      node.childCount === 0 &&
      !state.inTable
    ) {
      state.write("\\\n");
    } else {
      state.renderInline(node);
      state.closeBlock(node);
    }
  }

  parseMarkdown() {
    return { block: "paragraph" };
  }
}
