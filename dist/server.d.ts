export declare const schema: any;
export declare const parseMarkdown: (markdown: string) => import("prosemirror-model").Node | null;
export declare const mdToHtml: (document: Document) => (markdown: string) => string;
export declare const externalHtmlOrMdToHtml: (isHTML_?: (str: any) => boolean, document_?: Document) => (content: string) => string;
//# sourceMappingURL=server.d.ts.map