import { Schema, Node as ProsemirrorNode } from "prosemirror-model";
export declare const schema: Schema<never, never>;
export declare const serializeHTML: (document_?: Document) => (html: string) => string;
export declare const parseMarkdown: (markdown: string) => ProsemirrorNode | null;
export declare const mdToHtml: (document: Document) => (markdown: string) => string;
export declare const externalHtmlOrMdToHtml: (isHTML_?: (str: any) => boolean, document_?: Document) => (content: string) => string;
//# sourceMappingURL=server.d.ts.map