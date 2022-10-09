import removeMarks from './removeMarks';
import { defaultMarkClick } from './defaultMarkClick';
import type { MenuItem } from '../types'
import { EditorView } from 'prosemirror-view';
import { MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";


interface Input {
    item: MenuItem;
    commands: Record<string, any>;
    isMarkActive: (state: EditorState) => boolean;
    view: EditorView;
    allMarks: MarkType[];
}
/**
 * Guarentees that a mark is toggled.
 * Right now, it's used for background highlighting 
 * because clicking an active highlight does not disable it
 */
export const toggleMark = (
    input: Input,
) => {
    const { item, 
        commands, 
        isMarkActive,
        view,
        allMarks, } = input;

    if ( !isMarkActive( view.state ) ) {
        defaultMarkClick( {
            item,
            commands,
        } );
    }
    else {
        removeMarks(
            view,
            allMarks,
        );
    }
}