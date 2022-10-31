import { MenuItem, DeviceType, DefaultHighlight, DefaultBackground, SetDefaultBackground, SetDefaultHighlight } from "../types";
import baseDictionary from "../dictionary";
import { EditorView } from "prosemirror-view";
interface FormattingMenuItemsInput {
    view: EditorView;
    isTemplate: boolean;
    dictionary: typeof baseDictionary;
    deviceType?: DeviceType;
    commands: Record<string, any>;
    defaultHighlight?: DefaultHighlight;
    defaultBackground?: DefaultBackground;
    setDefaultHighlight?: SetDefaultHighlight;
    setDefaultBackground?: SetDefaultBackground;
}
export default function formattingMenuItems(input: FormattingMenuItemsInput): MenuItem[];
export {};
//# sourceMappingURL=formatting.d.ts.map