import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
import emojiRule from "../rules/emoji";
export default class Emoji extends Node {
    get name(): string;
    get schema(): {
        attrs: {
            style: {
                default: string;
            };
            "data-name": {
                default: undefined;
            };
        };
        inline: boolean;
        content: string;
        marks: string;
        group: string;
        selectable: boolean;
        draggable: boolean;
        parseDOM: {
            tag: string;
            preserveWhitespace: string;
            getAttrs: (dom: HTMLDivElement) => {
                "data-name": string | undefined;
            };
        }[];
        toDOM: (node: any) => (string | Text | {
            class: string;
            "data-name": any;
        })[] | (string | Text | {
            class: string;
        })[];
    };
    get rulePlugins(): (typeof emojiRule)[];
    commands({ type }: {
        type: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    inputRules({ type }: {
        type: any;
    }): InputRule[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (tok: any) => {
            "data-name": any;
        };
    };
}
//# sourceMappingURL=Emoji.d.ts.map