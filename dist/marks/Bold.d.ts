import Mark from "./Mark";
export default class Bold extends Mark {
    get name(): string;
    get schema(): {
        parseDOM: ({
            tag: string;
            style?: undefined;
            getAttrs?: undefined;
        } | {
            style: string;
            getAttrs: (value: any) => boolean;
            tag?: undefined;
        })[];
        toDOM: () => string[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        "Mod-b": import("prosemirror-state").Command;
        "Mod-B": import("prosemirror-state").Command;
    };
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
//# sourceMappingURL=Bold.d.ts.map