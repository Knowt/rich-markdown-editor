// import { toggleMark } from "prosemirror-commands";
import { MarkType } from "@knowt/prosemirror-model";
import { EditorView } from "prosemirror-view";
import isMarkActive from "../queries/isMarkActive";

export default function removeMarks(view: EditorView, marks: MarkType[]): void {
  const { state } = view;
  const {
    tr,
    selection: { from, to },
  } = state;

  tr.setStoredMarks([]);

  marks
    .filter((mark) => isMarkActive(mark)(state))
    .forEach((mark) => tr.removeMark(from, to, mark));

  view.dispatch(tr);
}
