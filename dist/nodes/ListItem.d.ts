import { Plugin } from "prosemirror-state";
import { DecorationSet } from "prosemirror-view";
import Node from "./Node";
export default class ListItem extends Node {
    get name(): string;
    get schema(): {
        content: string;
        defining: boolean;
        draggable: boolean;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | number)[];
    };
    get plugins(): Plugin<DecorationSet<any>>[];
    keys({ type }: {
        type: any;
    }): {
        Enter: (state: any, dispatch: any) => boolean;
        Tab: import("prosemirror-state").Command;
        "Shift-Tab": import("prosemirror-state").Command;
        "Mod-]": import("prosemirror-state").Command;
        "Mod-[": import("prosemirror-state").Command;
        "Shift-Enter": (state: any, dispatch: any) => boolean;
        "Alt-ArrowUp": (state: any, dispatch: any) => boolean;
        "Alt-ArrowDown": (state: any, dispatch: any) => boolean;
    };
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=ListItem.d.ts.map