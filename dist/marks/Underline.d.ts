import Mark from "./Mark";
import underlinesRule from "../rules/underlines";
import { UNDERLINE_SHORTCUT1, UNDERLINE_SHORTCUT2 } from '../lib/constants';
export default class Underline extends Mark {
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
        toDOM: () => (string | number)[];
    };
    get rulePlugins(): (typeof underlinesRule)[];
    inputRules({ type }: {
        type: any;
    }): import("prosemirror-inputrules").InputRule[];
    keys({ type }: {
        type: any;
    }): {
        "Mod-u": import("prosemirror-state").Command;
        "Mod-U": import("prosemirror-state").Command;
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
//# sourceMappingURL=Underline.d.ts.map