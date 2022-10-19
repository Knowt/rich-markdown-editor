import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import Node from "./Node";
export default class Image extends Node {
    get name(): string;
    get schema(): {
        inline: boolean;
        attrs: {
            src: {};
            alt: {
                default: null;
            };
            title: {
                default: null;
            };
            width: {
                default: null;
            };
            height: {
                default: null;
            };
        };
        content: string;
        marks: string;
        group: string;
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLDivElement) => {
                src: string | null;
                alt: string | null;
                title: string | null;
            };
        }[];
        toDOM: (node: any) => (string | any[] | {
            class: string;
        })[];
    };
    handleCaptionKeyDown: ({ node, getPos }: {
        node: any;
        getPos: any;
    }) => (event: any) => void;
    handleCaptionBlur: ({ node, getPos }: {
        node: any;
        getPos: any;
    }) => (event: any) => void;
    handleSelect: ({ getPos }: {
        getPos: any;
    }) => () => void;
    resizeImage: ({ node, getPos, width, height }: {
        node: any;
        getPos: any;
        width: any;
        height: any;
    }) => void;
    component: (props: any) => JSX.Element;
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (token: any) => {
            src: any;
            alt: any;
            title: any;
            width: any;
            height: any;
        };
    };
    commands({ type }: {
        type: any;
    }): {
        deleteImage: () => (state: any, dispatch: any) => boolean;
        replaceImage: () => (state: any) => void;
        createImage: () => () => void;
    };
    inputRules({ type }: {
        type: any;
    }): InputRule[];
    get rulePlugins(): any[];
    get plugins(): Plugin<any>[];
}
//# sourceMappingURL=Image.d.ts.map