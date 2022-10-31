import { EmbedDescriptor, GroupMenuItem } from "../types";
import baseDictionary from "../dictionary";
import { EditorView } from "prosemirror-view";
export declare const getGroupedMenuItems: (view: EditorView, dictionary: typeof baseDictionary, deviceType: any) => GroupMenuItem[];
export declare const getEmbedsGroup: (embeds: EmbedDescriptor[]) => GroupMenuItem;
//# sourceMappingURL=block.d.ts.map