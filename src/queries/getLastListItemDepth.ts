import { Node } from 'prosemirror-model'

/**
 * Gets the nested level of a provided list node.
 * Returns the nested level of the LAST list item.
 */
export const getLastListItemDepth = ( node: Node ) => {
    let depth = 0;

    const traverseList = ( node: Node ) => {
      try {
        // @ts-ignore
        const innerNodes = node.content.content as Node[];
        const lastListItem = innerNodes[ innerNodes.length - 1 ];
        // @ts-ignore
        const lastListItemContent = lastListItem.content.content as Node[];

        // when the last list item has another list inside of it as the second element
        if ( lastListItemContent.length === 2 ) {
          depth += 1;

          traverseList( lastListItemContent[ lastListItemContent.length - 1 ] );
        }
      }
      catch ( error ) {
        console.warn( error );

        return depth;
      }
    }

    traverseList( node );

    return depth;
}