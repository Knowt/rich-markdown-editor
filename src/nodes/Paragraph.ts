import { setBlockType } from "prosemirror-commands";
import Node from "./Node";
import { EditorState, TextSelection } from 'prosemirror-state';
import { findParentNodeClosestToPos, findParentNode } from '@knowt/prosemirror-utils';
import { isParentParagraph } from '../queries/isParentParagraph';
import { getLastListItemDepth } from '../queries/getLastListItemDepth';
import isList from "../queries/isList";
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
          const { selection, tr, doc, schema } = state;
  
          const parentParagraph = findParentNode( ( node ) => node.type.name === 'paragraph' )(
            selection
          );
  
          if (
            parentParagraph &&
            selection.from === selection.to &&
            parentParagraph.start === selection.from
          ) {
            // makes checks to backspace content from a paragraph to previous nodes
            const prevNodePos = selection.from - 2;
            const newPos = doc.resolve( prevNodePos );
    
            // brings backspaced content from a paragraph into the last cell of a table
            const prevTable = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => node.type.name === 'table',
            );
  
            if ( prevTable ) {
              const handleDispatch = ( rangeEnd: number=0 ) => {
                const lastCellPos = prevNodePos - 3;
                const paragraphText = parentParagraph.node.textContent;
                
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

            // brings backspaced content to the LAST list item of a list
            const prevList = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => isList( node, schema ) 
            );

            if ( prevList ) {
              const steps = getLastListItemDepth( prevList.node );
              const lastListItemPos = selection.from - 4 - steps * 2;
              const paragraphText = parentParagraph.node.textContent;

              const handleDispatch = ( rangeEnd: number=0 ) => {
                dispatch(
                  tr.deleteRange(
                    selection.from,
                    selection.from + paragraphText.length + rangeEnd,
                  )
                  .insertText( paragraphText, lastListItemPos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( lastListItemPos )
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

            // brings backspaced content to a blockquote
            const prevBlockQuote = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => node.type.name === 'blockquote'
            );

            if ( prevBlockQuote ) {
              const blockQuotePos = selection.from - 3;
              const paragraphText = parentParagraph.node.textContent;

              const handleDispatch = ( rangeEnd: number=0 ) => {
                dispatch(
                  tr.deleteRange(
                    selection.from,
                    selection.from + paragraphText.length + rangeEnd,
                  )
                  .insertText( paragraphText, blockQuotePos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( blockQuotePos )
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
