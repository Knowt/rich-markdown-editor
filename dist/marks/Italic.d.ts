import Mark from "./Mark";
export default class Italic extends Mark {
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
        "Mod-i": import("prosemirror-state").Command;
        "Mod-I": import("prosemirror-state").Command;
    };
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
        escape: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Italic.d.ts.map