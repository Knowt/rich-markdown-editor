import { setBlockType } from "prosemirror-commands";
import Node from "./Node";
import { EditorState, TextSelection } from 'prosemirror-state';
import { findParentNodeClosestToPos, findParentNode } from '@knowt/prosemirror-utils';
import { isParentParagraph } from '../queries/isParentParagraph';
import { getLastListItemDepth } from '../queries/getLastListItemDepth';
import isList from "../queries/isList";
import { Node as ProseMirrorNode } from 'prosemirror-model';
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
            let backspacePos: number | undefined = undefined;
            
            // brings backspaced content from a paragraph into the last cell of a table
            const prevTable = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => node.type.name === 'table',
            );
  
            if ( prevTable ) {
              backspacePos = prevNodePos - 3;
            }

            // brings backspaced content to the LAST list item of a list
            const prevList = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => isList( node, schema ) 
            );

            if ( prevList ) {
              const steps = getLastListItemDepth( prevList.node );
              backspacePos = selection.from - 4 - steps * 2;
            }

            // brings backspaced content to a blockquote
            const prevBlockQuote = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => node.type.name === 'blockquote'
            );

            if ( prevBlockQuote ) {
              backspacePos = selection.from - 3;

              // check to see if a node is within the blockquote as the last child
              // @ts-ignore
              const innerNodes = prevBlockQuote.node.content?.content as ProseMirrorNode[];
              // @ts-ignore
              const lastNode = innerNodes[innerNodes.length - 1] as ProseMirrorNode;
              const lastNodeType = lastNode.type.name;

              if ( 
                lastNodeType === 'checkbox_list' ||
                lastNodeType === 'bullet_list' ||
                lastNodeType === 'ordered_list'
              ) {
                backspacePos -= ( getLastListItemDepth( lastNode ) + 1 ) * 2;
              }
              else if ( lastNodeType === 'table' ) {
                backspacePos -= 3;
              }
            }

            if ( typeof backspacePos === 'number' ) {
              const paragraphText = parentParagraph.node.textContent;

              const handleDispatch = ( rangeEnd: number=0 ) => {
                dispatch(
                  tr.deleteRange(
                    selection.from - 1,
                    selection.from + paragraphText.length + rangeEnd,
                  )
                  .insertText( paragraphText, backspacePos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( backspacePos )
                  ) )
                );
              }

              try {
                // +2 handles deletion of line
                handleDispatch( 2 );
              }
              catch {
                // edge case for if writing on bottom of doc and there is no line to delete
                handleDispatch( 1 );
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
