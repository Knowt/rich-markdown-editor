import { Node as ProsemirrorNode, NodeType } from "@knowt/prosemirror-model";
import { MarkdownSerializerState } from "prosemirror-markdown";
import Node from "./Node";
export default class Heading extends Node {
    className: string;
    get name(): string;
    get defaultOptions(): {
        levels: number[];
        collapsed: undefined;
        softToDOM: boolean;
    };
    get schema(): {
        attrs: {
            level: {
                default: number;
            };
            collapsed: {
                default: undefined;
            };
        };
        content: string;
        group: string;
        defining: boolean;
        draggable: boolean;
        parseDOM: any;
        toDOM: (node: any, document_: any) => (string | any[])[];
    };
    toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode): void;
    parseMarkdown(): {
        block: string;
        getAttrs: (token: Record<string, any>) => {
            level: number;
        };
    };
    commands({ type, schema }: {
        type: any;
        schema: any;
    }): (attrs: Record<string, any>) => (state: any, dispatch: any) => boolean;
    handleFoldContent: (event: any) => void;
    keys({ type, schema }: {
        type: any;
        schema: any;
    }): any;
    get plugins(): any[];
    inputRules({ type }: {
        type: NodeType;
    }): any;
}
//# sourceMappingURL=Heading.d.ts.map