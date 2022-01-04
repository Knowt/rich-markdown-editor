import { EditorState } from "prosemirror-state";
import { MenuItem } from "../types";
import baseDictionary from "../dictionary";
export default function formattingMenuItems(state: EditorState, isTemplate: boolean, dictionary: typeof baseDictionary): (MenuItem & {
    iconColor?: string;
})[];
//# sourceMappingURL=formatting.d.ts.map