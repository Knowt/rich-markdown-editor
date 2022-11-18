import { EditorState, Transaction } from "prosemirror-state";
import type { NodeType } from "prosemirror-model";
export default function toggleList(listType: NodeType, itemType: NodeType): (state: EditorState, dispatch: (tr: Transaction) => void) => boolean;
//# sourceMappingURL=toggleList.d.ts.map