import * as React from "react";
import { EditorState, Plugin } from "prosemirror-state";
import { MarkdownParser, MarkdownSerializer } from "prosemirror-markdown";
import { EditorView } from "prosemirror-view";
import { Schema, NodeSpec, MarkSpec, DOMParser } from "prosemirror-model";
import { InputRule } from "prosemirror-inputrules";
import baseDictionary from "./dictionary";
import { SearchResult } from "./components/LinkEditor";
import ExtensionManager from "./lib/ExtensionManager";
import ComponentView from "./lib/ComponentView";
import Extension from "./lib/Extension";
import { PluginSimple } from "markdown-it";
export { default as Extension } from "./lib/Extension";
import { EmbedDescriptor, ToastType, DefaultHighlight, DefaultBackground, ExtensionNames } from "./types";
export declare const theme: {
    background: string;
    text: string;
    code: string;
    cursor: string;
    divider: string;
    linkHoverBackground: string;
    toolbarBackground: string;
    toolbarShadow: string;
    toolbarHoverBackground: string;
    toolbarInput: string;
    toolbarItem: string;
    toolbarShortcutText: string;
    tableDivider: string;
    tableSelected: string;
    tableSelectedBackground: string;
    quote: string;
    codeBackground: string;
    codeBorder: string;
    horizontalRule: string;
    imageErrorBackground: string;
    scrollbarBackground: string;
    scrollbarThumb: string;
    fontFamily: string;
    fontFamilyMono: string;
    fontWeight: number;
    zIndex: number;
    link: string;
    placeholder: string;
    textSecondary: string;
    textLight: string;
    textHighlight: string;
    textHighlightForeground: string;
    selected: string;
    codeComment: string;
    codePunctuation: string;
    codeNumber: string;
    codeProperty: string;
    codeTag: string;
    codeString: string;
    codeSelector: string;
    codeAttr: string;
    codeEntity: string;
    codeKeyword: string;
    codeFunction: string;
    codeStatement: string;
    codePlaceholder: string;
    codeInserted: string;
    codeImportant: string;
    blockToolbarBackground: string;
    blockToolbarTrigger: string;
    blockToolbarTriggerIcon: string;
    blockToolbarItem: string;
    blockToolbarIcon: string;
    blockToolbarIconSelected: string;
    blockToolbarText: string;
    blockToolbarTextSelected: string;
    blockToolbarSelectedBackground: string;
    blockToolbarHoverBackground: string;
    blockToolbarDivider: string;
    blockToolbarExpandArrowColor: string;
    blockToolbarIconColor: string;
    blockToolbarTagBackgroundColor: string;
    noticeInfoBackground: string;
    noticeInfoText: string;
    noticeTipBackground: string;
    noticeTipText: string;
    noticeWarningBackground: string;
    noticeWarningText: string;
    black: string;
    almostBlack: string;
    lightBlack: string;
    lighterBlack: string;
    almostWhite: string;
    white: string;
    white10: string;
    white40: string;
    black10: string;
    primary: string;
    greyLight: string;
    grey: string;
    greyMid: string;
    greyDark: string;
    knowtOffWhite: string;
    knowtOffWhite2: string;
    knowtGreen: string;
    knowtGreyLight: string;
    knowtGrey: string;
    knowtGreyMid: string;
    knowtGreyStrong: string;
    highlights: {
        red: string;
        orange: string;
        yellow: string;
        green: string;
        blue: string;
    };
};
export declare type Props = {
    id?: string;
    defaultValue: string;
    placeholder: string;
    disableExtensions?: ExtensionNames[];
    fontScale?: number;
    readOnly?: boolean;
    readOnlyWriteCheckboxes?: boolean;
    dictionary?: Partial<typeof baseDictionary>;
    dark?: boolean;
    dir?: string;
    theme?: typeof theme;
    template?: boolean;
    headingsOffset?: number;
    maxLength?: number;
    scrollTo?: string;
    handleDOMEvents?: {
        [name: string]: (view: EditorView, event: Event) => boolean;
    };
    uploadImage?: (file: File) => Promise<string>;
    onBlur?: () => void;
    onFocus?: () => void;
    onSave?: (input: {
        done: boolean;
    }) => void;
    onCancel?: () => void;
    onChange?: (value: () => string) => void;
    onImageUploadStart?: () => void;
    onImageUploadStop?: () => void;
    onCreateLink?: (title: string) => Promise<string>;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onClickLink: (href: string, event: MouseEvent) => void;
    onHoverLink?: (event: MouseEvent) => boolean;
    onClickHashtag?: (tag: string, event: MouseEvent) => void;
    onGoToPreviousInput?: () => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    embeds: EmbedDescriptor[];
    onShowToast?: (message: string, code: ToastType) => void;
    className?: string;
    style?: React.CSSProperties;
    parseAsHTML: boolean;
    spellCheck?: boolean;
    defaultHighlightKey?: string;
    defaultBackgroundKey?: string;
    customExtensions?: Extension[];
    disableEmojiMenu?: boolean;
    disableBlockMenu?: boolean;
};
declare type State = {
    isRTL: boolean;
    isEditorFocused: boolean;
    selectionMenuOpen: boolean;
    blockMenuOpen: boolean;
    linkMenuOpen: boolean;
    blockMenuSearch: string;
    emojiMenuOpen: boolean;
    defaultHighlight?: DefaultHighlight | null;
    defaultBackground?: DefaultBackground | null;
};
declare class RichMarkdownEditor extends React.PureComponent<Props, State> {
    static defaultProps: {
        defaultValue: string;
        dir: string;
        fontScale: number;
        placeholder: string;
        onImageUploadStart: () => void;
        onImageUploadStop: () => void;
        onClickLink: (href: any) => void;
        embeds: never[];
        extensions: never[];
    };
    state: {
        isRTL: boolean;
        isEditorFocused: boolean;
        selectionMenuOpen: boolean;
        blockMenuOpen: boolean;
        linkMenuOpen: boolean;
        blockMenuSearch: string;
        emojiMenuOpen: boolean;
        defaultHighlight: undefined;
        defaultBackground: undefined;
    };
    isBlurred: boolean;
    extensions: ExtensionManager;
    element?: HTMLElement | null;
    view: EditorView;
    schema: Schema;
    serializer: MarkdownSerializer;
    mdParser: MarkdownParser;
    domParser: DOMParser;
    pasteParser: MarkdownParser;
    plugins: Plugin[];
    keymaps: Plugin[];
    inputRules: InputRule[];
    nodeViews: {
        [name: string]: (node: any, view: any, getPos: any, decorations: any) => ComponentView;
    };
    nodes: {
        [name: string]: NodeSpec;
    };
    marks: {
        [name: string]: MarkSpec;
    };
    commands: Record<string, any>;
    rulePlugins: PluginSimple[];
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    init(): void;
    createExtensions(customExtensions: Extension[] | undefined): ExtensionManager;
    createPlugins(): Plugin<any>[];
    createRulePlugins(): PluginSimple[];
    createKeymaps(): Plugin<any>[];
    createInputRules(): InputRule[];
    createNodeViews(): {};
    createCommands(): {};
    createNodes(): {};
    createMarks(): {};
    createSchema(): Schema<string, string>;
    createSerializer(): import("./lib/markdown/serializer").MarkdownSerializer;
    createMDParser(): MarkdownParser;
    createDOMParser(): DOMParser;
    createPasteParser(): MarkdownParser;
    createState(value?: string): EditorState;
    createDocument(content: string): import("prosemirror-model").Node | undefined;
    parseHtmlContent(content: string): import("prosemirror-model").Node;
    createView(): EditorView;
    scrollToAnchor(hash: string): void;
    calculateDir: () => void;
    getValue: () => string;
    handleChange: () => void;
    handleGoToPreviousInput: () => void;
    handleSave: () => void;
    handleSaveAndExit: () => void;
    handleEditorBlur: () => void;
    handleEditorFocus: () => void;
    handleOpenSelectionMenu: () => void;
    handleCloseSelectionMenu: () => void;
    handleOpenLinkMenu: () => void;
    handleCloseLinkMenu: () => void;
    handleOpenBlockMenu: (search: string) => void;
    handleCloseBlockMenu: () => void;
    handleSelectRow: (index: number, state: EditorState) => void;
    handleSelectColumn: (index: number, state: EditorState) => void;
    handleSelectTable: (state: EditorState) => void;
    getDefaultHighlightKey: () => string;
    getDefaultBackgroundKey: () => string;
    setDefaultHighlight: (defaultHighlight: DefaultHighlight) => void;
    setDefaultBackground: (defaultBackground: DefaultBackground) => void;
    getLocalStorageDefaults: () => {
        defaultHighlight: "highlight_blue" | "highlight_green" | "highlight_orange" | "highlight_red" | "highlight_yellow" | null;
        defaultBackground: "background_blue" | "background_green" | "background_orange" | "background_red" | "background_yellow" | null;
    };
    onHoverLink: () => void;
    forceUpdateContent: (newValue: string, options: {
        triggerOnChange?: boolean;
    }) => void;
    getHeadings: () => {
        title: string;
        level: number;
        id: string;
    }[];
    theme: () => {
        background: string;
        text: string;
        code: string;
        cursor: string;
        divider: string;
        linkHoverBackground: string;
        toolbarBackground: string;
        toolbarShadow: string;
        toolbarHoverBackground: string;
        toolbarInput: string;
        toolbarItem: string;
        toolbarShortcutText: string;
        tableDivider: string;
        tableSelected: string;
        tableSelectedBackground: string;
        quote: string;
        codeBackground: string;
        codeBorder: string;
        horizontalRule: string;
        imageErrorBackground: string;
        scrollbarBackground: string;
        scrollbarThumb: string;
        fontFamily: string;
        fontFamilyMono: string;
        fontWeight: number;
        zIndex: number;
        link: string;
        placeholder: string;
        textSecondary: string;
        textLight: string;
        textHighlight: string;
        textHighlightForeground: string;
        selected: string;
        codeComment: string;
        codePunctuation: string;
        codeNumber: string;
        codeProperty: string;
        codeTag: string;
        codeString: string;
        codeSelector: string;
        codeAttr: string;
        codeEntity: string;
        codeKeyword: string;
        codeFunction: string;
        codeStatement: string;
        codePlaceholder: string;
        codeInserted: string;
        codeImportant: string;
        blockToolbarBackground: string;
        blockToolbarTrigger: string;
        blockToolbarTriggerIcon: string;
        blockToolbarItem: string;
        blockToolbarIcon: string;
        blockToolbarIconSelected: string;
        blockToolbarText: string;
        blockToolbarTextSelected: string;
        blockToolbarSelectedBackground: string;
        blockToolbarHoverBackground: string;
        blockToolbarDivider: string;
        blockToolbarExpandArrowColor: string;
        blockToolbarIconColor: string;
        blockToolbarTagBackgroundColor: string;
        noticeInfoBackground: string;
        noticeInfoText: string;
        noticeTipBackground: string;
        noticeTipText: string;
        noticeWarningBackground: string;
        noticeWarningText: string;
        black: string;
        almostBlack: string;
        lightBlack: string;
        lighterBlack: string;
        almostWhite: string;
        white: string;
        white10: string;
        white40: string;
        black10: string;
        primary: string;
        greyLight: string;
        grey: string;
        greyMid: string;
        greyDark: string;
        knowtOffWhite: string;
        knowtOffWhite2: string;
        knowtGreen: string;
        knowtGreyLight: string;
        knowtGrey: string;
        knowtGreyMid: string;
        knowtGreyStrong: string;
        highlights: {
            red: string;
            orange: string;
            yellow: string;
            green: string;
            blue: string;
        };
    };
    dictionary: ((providedDictionary?: Partial<{
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
    }> | undefined) => {
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
    }) & import("lodash").MemoizedFunction;
    render(): JSX.Element;
}
export default RichMarkdownEditor;
//# sourceMappingURL=index.d.ts.map