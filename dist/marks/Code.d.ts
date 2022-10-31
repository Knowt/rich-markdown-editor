import Mark from "./Mark";
import { CODE_SHORTCUT1, CODE_SHORTCUT2 } from '../lib/constants';
export default class Code extends Mark {
    get name(): string;
    get schema(): {
        excludes: string;
        parseDOM: {
            tag: string;
            preserveWhitespace: boolean;
        }[];
        toDOM: () => (string | {
            spellCheck: boolean;
        })[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        "Mod-e": import("prosemirror-state").Command;
        "Mod-E": import("prosemirror-state").Command;
        ArrowLeft: (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
        ArrowRight: (state: import("prosemirror-state").EditorState, dispatch: (tr: import("prosemirror-state").Transaction) => void) => boolean;
    };
    get toMarkdown(): {
        open(_state: any, _mark: any, parent: any, index: any): string;
        close(_state: any, _mark: any, parent: any, index: any): string;
        escape: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Code.d.ts.map