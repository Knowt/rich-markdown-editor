import { NodeType } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { findParentNode } from "@knowt/prosemirror-utils";
import isList from "../queries/isList";

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
        else if ( parentList.node.type.name === 'checkbox_list' ) {
          const newParentList = { ...parentList };
          console.log( 'PARENT CONTENT BEFFORE' );
          console.log( newParentList.node.content )

          // @ts-ignore
          const content = parentList.node.content?.content as any[];

          parentList.node.content.content = content.map( ( node ) => {
            const newItem = state.schema.nodes.list_item.create( 
              undefined,
              node.content,
            );

            return newItem;
          } );

          console.log( 'PARENT CONTENT AFTER' );
          console.log( newParentList.node.content );

          const newList = state.schema.nodes.bullet_list.create( 
            undefined,
            parentList.node.content,
          );

          dispatch(
            state.tr.replaceSelectionWith(
              newList
            ),
          );

          return false;
        }
      }
    }

    return wrapInList(listType)(state, dispatch);
  };
}
