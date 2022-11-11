import { NodeType } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { findParentNode } from "@knowt/prosemirror-utils";
import isList from "../queries/isList";
import { replaceParentNodeOfType } from '@knowt/prosemirror-utils';

export default function toggleList(listType: NodeType, itemType: NodeType) {
  return (state: EditorState, dispatch: (tr: Transaction) => void) => {
    const { schema, selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    const parentList = findParentNode((node) => isList(node, schema))(
      selection
    );

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return liftListItem(itemType)(state, dispatch);
      }

      if ( isList(parentList.node, schema) ) {
        if ( listType.validContent(parentList.node.content) ) {
          const { tr } = state;
          tr.setNodeMarkup(parentList.pos, listType);

          if (dispatch) {
            dispatch(tr);
          }
  
          return false;
        }
        /**
         * Current solution has 2 problems:
         * 1. After change, selection gets reset unlike change between bullet and ordered
         * 2. Messed up undo and redo.
         */
        else {
          const newParentList = { ...parentList };
          // @ts-ignore
          const content = parentList.node.content?.content as any[];

          // @ts-ignore
          newParentList.node.content.content = content.map( ( node ) => {
            const newItem = itemType.create( 
              undefined,
              node.content,
            );

            return newItem;
          } );

          const newList = listType.create( 
            undefined,
            newParentList.node.content,
          );

          if ( dispatch ) {
            dispatch(
              replaceParentNodeOfType(newParentList.node.type, newList)(state.tr)
            );
          }

          return false;
        }
      }
    }

    return wrapInList(listType)(state, dispatch);
  };
}
