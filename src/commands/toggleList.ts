import { EditorState, Transaction } from "prosemirror-state";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { findParentNode } from "@knowt/prosemirror-utils";
import isList from "../queries/isList";
import { replaceParentNodeOfType } from '@knowt/prosemirror-utils';
import type { NodeType, Fragment, Node } from "prosemirror-model";

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
        // Handles conversion between checklists and other lists.
        // TODO - conversions between checklists resets selection
        // stop that from happening!
        if ( !listType.validContent(parentList.node.content) ) {
          try {
            // @ts-ignore
            const content = parentList.node.content?.content as Node[];
            let newContent: Fragment | undefined = undefined;

            content.forEach( ( node, index ) => {
              const contentToUse = newContent || parentList.node.content;
              const newItem = itemType.create( 
                undefined,
                node.content,
              );
  
              newContent = contentToUse.replaceChild(index, newItem);
            } );

            const newList = listType.create( 
              undefined,
              newContent,
            );

            if ( !newContent ) {
              throw( new Error( `Could not convert list from ${parentList.node.type.name} to ${listType.name}`) );
            }

            if ( dispatch ) {
              dispatch(
                replaceParentNodeOfType(parentList.node.type, newList)(state.tr)
              );
            }
  
            return false;
          }
          catch ( error ) {
            console.warn( error?.message );
          }
        }
        else {
          const { tr } = state;
          tr.setNodeMarkup(parentList.pos, listType);

          if (dispatch) {
            dispatch(tr);
          }
  
          return false;
        }
      }
    }

    return wrapInList(listType)(state, dispatch);
  };
}