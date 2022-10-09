import isMarkActive from "./isMarkActive";
import { EditorState } from "prosemirror-state";

export default function isHeading(
    state: EditorState,
): boolean {
  if (state.schema.nodes.heading) {
    const $head = state.selection.$head;

    return $head.parent.type === state.schema.nodes.heading;
  }

  return isMarkActive(state.schema.marks.heading)(state);
}