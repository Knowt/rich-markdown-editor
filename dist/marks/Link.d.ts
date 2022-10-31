import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Mark from "./Mark";
import { LINK_SHORTCUT1, LINK_SHORTCUT2 } from '../lib/constants';
export default class Link extends Mark {
    get name(): string;
    get schema(): {
        attrs: {
            href: {
                default: string;
            };
        };
        inclusive: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLElement) => {
                href: string | null;
            };
        }[];
        toDOM: (node: any) => any[];
    };
    private handleLinkShortcut;
    inputRules({ type }: {
        type: any;
    }): InputRule[];
    commands({ type }: {
        type: any;
    }): ({ href }?: {
        href: string;
    }) => import("prosemirror-state").Command;
    keys({ type }: {
        type: any;
    }): {
        "Mod-k": (state: any, dispatch: any) => boolean;
        "Mod-K": (state: any, dispatch: any) => boolean;
    };
    get plugins(): Plugin<any>[];
    get toMarkdown(): {
        open(_state: any, mark: any, parent: any, index: any): string;
        close(state: any, mark: any, parent: any, index: any): string;
    };
    parseMarkdown(): {
        mark: string;
        getAttrs: (tok: any) => {
            href: any;
            title: any;
        };
    };
}
//# sourceMappingURL=Link.d.ts.map