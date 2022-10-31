import Mark from "./Mark";
import { STRIKETHROUGH_SHORTCUT1, STRIKETHROUGH_SHORTCUT2 } from '../lib/constants';
export default class Strikethrough extends Mark {
    get name(): string;
    get schema(): {
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | number)[];
    };
    keys({ type }: {
        type: any;
    }): {
        "Mod-d": import("prosemirror-state").Command;
        "Mod-D": import("prosemirror-state").Command;
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
        escape: boolean;
    };
    get markdownToken(): string;
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Strikethrough.d.ts.map