import Node from "./Node";
export default class Embed extends Node {
    get name(): string;
    get schema(): {
        content: string;
        group: string;
        atom: boolean;
        attrs: {
            href: {};
        };
        parseDOM: {
            tag: string;
            getAttrs: (dom: HTMLIFrameElement) => {
                href: string;
            } | {
                href?: undefined;
            };
        }[];
        toDOM: (node: any) => (string | number | {
            class: string;
            src: any;
            contentEditable: boolean;
        })[];
    };
    get rulePlugins(): ((md: import("markdown-it/lib")) => void)[];
    component({ isEditable, isSelected, theme, node }: {
        isEditable: any;
        isSelected: any;
        theme: any;
        node: any;
    }): JSX.Element | null;
    commands({ type }: {
        type: any;
    }): (attrs: any) => (state: any, dispatch: any) => boolean;
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (token: any) => {
            href: any;
        };
    };
}
//# sourceMappingURL=Embed.d.ts.map