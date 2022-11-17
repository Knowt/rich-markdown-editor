import { EditorState, TextSelection } from 'prosemirror-state';

/**
 * Checks to see if the parent is ONLY a base paragraph.
 * NOTE - this is a shorthand method for performance.
 */
export const isParentParagraph = ( state: EditorState ) => {
    const selection = state.selection;
    const $head = selection.$head;

    
    return selection instanceof TextSelection &&
        // @ts-ignore
        $head?.path?.length === 6 &&
        $head.parent.type.name === 'paragraph';
}