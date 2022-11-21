import Node from "./Node";
import checkboxRule from "../rules/checkboxes";
export default class CheckboxItem extends Node {
    get name(): string;
    get defaultOptions(): {
        includeDrag: boolean;
    };
    get schema(): {
        attrs: {
            checked: {
                default: boolean;
            };
        };
        content: string;
        defining: boolean;
        draggable: any;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLLIElement) => {
                checked: boolean;
            };
        }[];
        toDOM: (node: any) => any[];
    };
    get rulePlugins(): (typeof checkboxRule)[];
    handleChange: (event: any) => void;
    keys({ type }: {
        type: any;
    }): {
        Enter: (state: any, dispatch: any) => boolean;
        Tab: import("prosemirror-state").Command;
        "Shift-Tab": import("prosemirror-state").Command;
        "Mod-]": import("prosemirror-state").Command;
        "Mod-[": import("prosemirror-state").Command;
    };
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            checked: boolean | undefined;
        };
    };
}
//# sourceMappingURL=CheckboxItem.d.ts.map