import Mark from "../Mark";
export default class DefaultHighlight extends Mark {
    get name(): string;
    get schema(): {
        attrs: {
            color: {
                default: string;
            };
        };
        excludes: string;
        group: string;
        parseDOM: ({
            tag: string;
            style?: undefined;
            getAttrs?: undefined;
        } | {
            style: string;
            getAttrs: (value: any) => boolean;
            tag?: undefined;
        })[];
        toDOM: () => (string | {
            class: string;
        })[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        "Alt-Shift-1": (state: import("prosemirror-state").EditorState, dispatch: any) => boolean;
    };
    commands({ type }: {
        type: any;
    }): () => (state: import("prosemirror-state").EditorState, dispatch: any) => boolean;
    get rulePlugins(): ((md: any) => void)[];
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=DefaultHighlight.d.ts.map