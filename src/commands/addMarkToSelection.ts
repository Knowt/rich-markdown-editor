import { EditorState } from "prosemirror-state";

export default function addMarkToSelection(type, attrs = {}) {
  return (state: EditorState<any>, dispatch): boolean => {
    dispatch(
      state.tr.addMark(
        state.selection.from,
        state.selection.to,
        type.create(attrs)
      )
    );
    return true;
  };
}
