import Node from "./Node";
export default class CodeFence extends Node {
    get languageOptions(): [string, string][];
    get name(): string;
    get schema(): {
        attrs: {
            language: {
                default: string;
            };
        };
        content: string;
        marks: string;
        group: string;
        code: boolean;
        defining: boolean;
        draggable: boolean;
        parseDOM: ({
            tag: string;
            preserveWhitespace: string;
            contentElement?: undefined;
            getAttrs?: undefined;
        } | {
            tag: string;
            preserveWhitespace: string;
            contentElement: string;
            getAttrs: (dom: HTMLDivElement) => {
                language: string | undefined;
            };
        })[];
        toDOM: (node: any, document_?: Document) => (string | {
            class: string;
            "data-language": any;
        } | (string | HTMLButtonElement | HTMLSelectElement | {
            contentEditable: boolean;
        })[] | (string | (string | number | {
            spellCheck: boolean;
        })[])[])[];
    };
    commands({ type, schema }: {
        type: any;
        schema: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    keys({ type, schema }: {
        type: any;
        schema: any;
    }): {
        "Shift-Ctrl-\\": (state: any, dispatch: any) => boolean;
        "Shift-Enter": (state: any, dispatch: any) => boolean;
        Tab: (state: any, dispatch: any) => boolean;
    };
    handleCopyToClipboard: (event: any) => void;
    handleLanguageChange: (event: any) => void;
    get plugins(): import("prosemirror-state").Plugin<any>[];
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    toMarkdown(state: any, node: any): void;
    get markdownToken(): string;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            language: any;
        };
    };
}
//# sourceMappingURL=CodeFence.d.ts.map