import Mark from "../Mark";
import { RED_HIGHLIGHT_SHORTCUT } from '../../lib/constants';
export default class RedHighlight extends Mark {
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
            getAttrs: (node: any) => boolean;
            style?: undefined;
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
        "Alt-Shift-1": import("prosemirror-state").Command;
    };
    commands({ type }: {
        type: any;
    }): () => import("prosemirror-state").Command;
    get rulePlugins(): ((md: any) => void)[];
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
//# sourceMappingURL=RedHighlight.d.ts.map