import { EditorState, Transaction } from "prosemirror-state";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { findParentNode, setTextSelection } from "@knowt/prosemirror-utils";
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
        try {
          const convertListItemContent = ( 
            content: Node[],
            outerList: Fragment,
          ) => {
            let newContent: Fragment | undefined = undefined;

            content.forEach( ( node, index ) => {
              const newItem = itemType.create( 
                undefined,
                node.content,
              );

              const contentToUse = newContent || outerList;
              newContent = contentToUse.replaceChild(index, newItem);

              if (
                // @ts-ignore
                newContent?.content?.[index]?.content?.content?.[1] &&
                // @ts-ignore
                isList( newContent.content[index].content.content[1], state.schema )
              ) {
                // @ts-ignore
                newContent.content[index].content = newContent.content[index].content.replaceChild(
                  1,
                  convertListItemContent(
                    // @ts-ignore
                    newContent.content[index].content.content[1].content.content,
                    // @ts-ignore
                    newContent.content[index].content.content[1].content,
                  )
                );
              }
            } );

            return listType.create( 
              undefined,
              newContent,
            );
          }

          const newList = convertListItemContent( 
            // @ts-ignore
            parentList.node.content?.content, 
            parentList.node.content 
          );

          if ( dispatch ) {
            dispatch(
              setTextSelection( parentList.pos )(
                replaceParentNodeOfType(parentList.node.type, newList)(state.tr)
              )
            );
          }

          return false;
        }
        catch ( error ) {
          console.warn( `Could not convert list from ${parentList.node.type.name} to ${listType.name}` );

          if ( listType.validContent(parentList.node.content) ) {
            const { tr } = state;
            tr.setNodeMarkup(parentList.pos, listType);
  
            if (dispatch) {
              dispatch(tr);
            }
    
            return false;
          }
        }
      }
    }

    return wrapInList(listType)(state, dispatch);
  };
}