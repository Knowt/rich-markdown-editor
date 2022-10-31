import Mark from "../Mark";
import { RED_BACKGROUND_SHORTCUT } from '../../lib/constants';
export default class RedBackground extends Mark {
    get name(): string;
    get schema(): {
        attrs: {
            color: {
                default: string;
            };
        };
        excludes: string;
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => (string | {
            class: string;
            'data-type': string;
        })[];
    };
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        "Alt-Shift-6": import("prosemirror-state").Command;
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
//# sourceMappingURL=RedBackground.d.ts.map