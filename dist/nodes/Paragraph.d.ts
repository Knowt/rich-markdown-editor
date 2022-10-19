import Node from "./Node";
import { EditorState } from 'prosemirror-state';
export default class Paragraph extends Node {
    get name(): string;
    get schema(): {
        content: string;
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | number)[];
    };
    keys({ type }: {
        type: any;
    }): {
        "Shift-Ctrl-0": import("prosemirror-state").Command;
        Tab: (state: EditorState, dispatch: any) => void;
    };
    commands({ type }: {
        type: any;
    }): () => import("prosemirror-state").Command;
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=Paragraph.d.ts.map