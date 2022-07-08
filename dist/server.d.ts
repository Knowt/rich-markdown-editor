import { Schema, Node as ProsemirrorNode } from "prosemirror-model";
export declare const schema: Schema<never, never>;
export declare const parseMarkdown: (markdown: string) => ProsemirrorNode | null;
export declare const externalHtmlOrMdToHtml: (isHTML_?: (str: any) => boolean, document_?: Document) => (content: string) => string;
//# sourceMappingURL=server.d.ts.map