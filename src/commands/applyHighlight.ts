import { toggleMark } from "prosemirror-commands";
import { EditorState } from "prosemirror-state";
import addMarkToSelection from "./addMarkToSelection";

export default function applyHighlight(type) {
  return (state: EditorState, dispatch) => {
    if (state.selection.empty) {
      return toggleMark(type)(state, dispatch);
    }

    return addMarkToSelection(type)(state, dispatch);
  };
}
