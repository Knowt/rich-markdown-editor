import Node from "./Node";
export default class OrderedList extends Node {
    get name(): string;
    get schema(): {
        attrs: {
            order: {
                default: number;
            };
        };
        content: string;
        group: string;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLOListElement) => {
                order: number;
            };
        }[];
        toDOM: (node: any) => (string | number | {
            start: any;
        })[];
    };
    commands({ type, schema }: {
        type: any;
        schema: any;
    }): () => (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
    keys({ type, schema }: {
        type: any;
        schema: any;
    }): {
        "Shift-Ctrl-9": (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            order: number;
        };
    };
}
//# sourceMappingURL=OrderedList.d.ts.map