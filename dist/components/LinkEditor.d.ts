import * as React from "react";
import { EditorView } from "prosemirror-view";
import { Mark } from "prosemirror-model";
import theme from "../styles/theme";
import baseDictionary from "../dictionary";
export declare type SearchResult = {
    title: string;
    subtitle?: string;
    url: string;
};
declare type Props = {
    mark?: Mark;
    from: number;
    to: number;
    tooltip: typeof React.Component | React.FC<any>;
    dictionary: typeof baseDictionary;
    onRemoveLink?: () => void;
    onCreateLink?: (title: string) => Promise<void>;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onSelectLink: (options: {
        href: string;
        title?: string;
        from: number;
        to: number;
    }) => void;
    onClickLink: (href: string, event: MouseEvent) => void;
    onShowToast?: (message: string, code: string) => void;
    view: EditorView;
    theme: typeof theme;
};
declare type State = {
    results: {
        [keyword: string]: SearchResult[];
    };
    value: string;
    previousValue: string;
    selectedIndex: number;
};
declare class LinkEditor extends React.Component<Props, State> {
    discardInputValue: boolean;
    initialValue: string;
    initialSelectionLength: number;
    state: State;
    get href(): string;
    get suggestedLinkTitle(): string;
    componentWillUnmount: () => void;
    save: (href: string, title?: string | undefined) => void;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    handleFocusLink: (selectedIndex: number) => void;
    handleChange: (event: any) => Promise<void>;
    handlePaste: () => void;
    handleOpenLink: (event: any) => void;
    handleCreateLink: (value: string) => Promise<void> | undefined;
    handleRemoveLink: () => void;
    handleSelectLink: (url: string, title: string) => (event: any) => void;
    moveSelectionToEnd: () => void;
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<{
    mark?: Mark | undefined;
    view: EditorView<any>;
    tooltip: typeof React.Component | React.FC<any>;
    ref?: ((instance: LinkEditor | null) => void) | React.RefObject<LinkEditor> | null | undefined;
    key?: string | number | null | undefined;
    from: number;
    to: number;
    dictionary: {
        addColumnAfter: string;
        addColumnBefore: string;
        addRowAfter: string;
        addRowBefore: string;
        alignCenter: string;
        alignLeft: string;
        alignRight: string;
        bulletList: string;
        checkboxList: string;
        codeBlock: string;
        codeCopied: string;
        codeInline: string;
        createLink: string;
        createLinkError: string;
        createNewDoc: string;
        deleteColumn: string;
        deleteRow: string;
        deleteTable: string;
        deleteImage: string;
        downloadImage: string;
        replaceImage: string;
        alignImageLeft: string;
        alignImageRight: string;
        alignImageDefault: string;
        em: string;
        embedInvalidLink: string;
        findOrCreateDoc: string;
        h1: string;
        h2: string;
        h3: string;
        heading: string;
        hr: string;
        image: string;
        imageUploadError: string;
        imageCaptionPlaceholder: string;
        info: string;
        infoNotice: string;
        link: string;
        linkCopied: string;
        mark: string;
        newLineEmpty: string;
        newLineWithSlash: string;
        noResults: string;
        openLink: string;
        orderedList: string;
        pageBreak: string;
        pasteLink: string;
        pasteLinkWithTitle: (title: string) => string;
        placeholder: string;
        quote: string;
        removeLink: string;
        searchOrPasteLink: string;
        strikethrough: string;
        strong: string;
        subheading: string;
        table: string;
        tip: string;
        tipNotice: string;
        warning: string;
        warningNotice: string;
    };
    onRemoveLink?: (() => void) | undefined;
    onCreateLink?: ((title: string) => Promise<void>) | undefined;
    onSearchLink?: ((term: string) => Promise<SearchResult[]>) | undefined;
    onSelectLink: (options: {
        href: string;
        title?: string | undefined;
        from: number;
        to: number;
    }) => void;
    onClickLink: (href: string, event: MouseEvent) => void;
    onShowToast?: ((message: string, code: string) => void) | undefined;
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=LinkEditor.d.ts.map