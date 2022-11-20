"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = exports.Extension = void 0;
const React = __importStar(require("react"));
const memoize_1 = __importDefault(require("lodash/memoize"));
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_dropcursor_1 = require("prosemirror-dropcursor");
const prosemirror_gapcursor_1 = require("prosemirror-gapcursor");
const prosemirror_view_1 = require("prosemirror-view");
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_keymap_1 = require("prosemirror-keymap");
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
const styled_components_1 = require("styled-components");
const theme_1 = require("./styles/theme");
const dictionary_1 = __importDefault(require("./dictionary"));
const Flex_1 = __importDefault(require("./components/Flex"));
const SelectionToolbar_1 = __importDefault(require("./components/SelectionToolbar"));
const BlockMenu_1 = __importDefault(require("./components/BlockMenu"));
const EmojiMenu_1 = __importDefault(require("./components/EmojiMenu"));
const LinkToolbar_1 = __importDefault(require("./components/LinkToolbar"));
const ExtensionManager_1 = __importDefault(require("./lib/ExtensionManager"));
const ComponentView_1 = __importDefault(require("./lib/ComponentView"));
const headingToSlug_1 = __importDefault(require("./lib/headingToSlug"));
const constants_1 = require("./lib/constants");
const react_device_detect_1 = require("react-device-detect");
const Doc_1 = __importDefault(require("./nodes/Doc"));
const Text_1 = __importDefault(require("./nodes/Text"));
const Blockquote_1 = __importDefault(require("./nodes/Blockquote"));
const BulletList_1 = __importDefault(require("./nodes/BulletList"));
const CodeBlock_1 = __importDefault(require("./nodes/CodeBlock"));
const CodeFence_1 = __importDefault(require("./nodes/CodeFence"));
const CheckboxList_1 = __importDefault(require("./nodes/CheckboxList"));
const Emoji_1 = __importDefault(require("./nodes/Emoji"));
const CheckboxItem_1 = __importDefault(require("./nodes/CheckboxItem"));
const Embed_1 = __importDefault(require("./nodes/Embed"));
const HardBreak_1 = __importDefault(require("./nodes/HardBreak"));
const Heading_1 = __importDefault(require("./nodes/Heading"));
const HorizontalRule_1 = __importDefault(require("./nodes/HorizontalRule"));
const Image_1 = __importDefault(require("./nodes/Image"));
const ListItem_1 = __importDefault(require("./nodes/ListItem"));
const Notice_1 = __importDefault(require("./nodes/Notice"));
const OrderedList_1 = __importDefault(require("./nodes/OrderedList"));
const Paragraph_1 = __importDefault(require("./nodes/Paragraph"));
const Table_1 = __importDefault(require("./nodes/Table"));
const TableCell_1 = __importDefault(require("./nodes/TableCell"));
const TableHeadCell_1 = __importDefault(require("./nodes/TableHeadCell"));
const TableRow_1 = __importDefault(require("./nodes/TableRow"));
const Bold_1 = __importDefault(require("./marks/Bold"));
const Code_1 = __importDefault(require("./marks/Code"));
const RedHighlight_1 = __importDefault(require("./marks/highlights/RedHighlight"));
const OrangeHighlight_1 = __importDefault(require("./marks/highlights/OrangeHighlight"));
const YellowHighlight_1 = __importDefault(require("./marks/highlights/YellowHighlight"));
const GreenHighlight_1 = __importDefault(require("./marks/highlights/GreenHighlight"));
const BlueHighlight_1 = __importDefault(require("./marks/highlights/BlueHighlight"));
const backgrounds_1 = require("./marks/backgrounds");
const Italic_1 = __importDefault(require("./marks/Italic"));
const Link_1 = __importDefault(require("./marks/Link"));
const Strikethrough_1 = __importDefault(require("./marks/Strikethrough"));
const Placeholder_1 = __importDefault(require("./marks/Placeholder"));
const Underline_1 = __importDefault(require("./marks/Underline"));
const BlockMenuTrigger_1 = __importDefault(require("./plugins/BlockMenuTrigger"));
const EmojiTrigger_1 = __importDefault(require("./plugins/EmojiTrigger"));
const Folding_1 = __importDefault(require("./plugins/Folding"));
const History_1 = __importDefault(require("./plugins/History"));
const Keys_1 = __importDefault(require("./plugins/Keys"));
const MaxLength_1 = __importDefault(require("./plugins/MaxLength"));
const Placeholder_2 = __importDefault(require("./plugins/Placeholder"));
const SmartText_1 = __importDefault(require("./plugins/SmartText"));
const TrailingNode_1 = __importDefault(require("./plugins/TrailingNode"));
const PasteHandler_1 = __importDefault(require("./plugins/PasteHandler"));
const domHelpers_1 = require("./domHelpers");
const GoToPreviousInputTrigger_1 = __importDefault(require("./plugins/GoToPreviousInputTrigger"));
var Extension_1 = require("./lib/Extension");
Object.defineProperty(exports, "Extension", { enumerable: true, get: function () { return __importDefault(Extension_1).default; } });
const editor_1 = require("./styles/editor");
exports.theme = theme_1.light;
class RichMarkdownEditor extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isRTL: false,
            isEditorFocused: false,
            selectionMenuOpen: false,
            blockMenuOpen: false,
            linkMenuOpen: false,
            blockMenuSearch: "",
            emojiMenuOpen: false,
            defaultHighlight: undefined,
            defaultBackground: undefined,
        };
        this.calculateDir = () => {
            if (!this.element)
                return;
            const isRTL = this.props.dir === "rtl" ||
                getComputedStyle(this.element).direction === "rtl";
            if (this.state.isRTL !== isRTL) {
                this.setState({ isRTL });
            }
        };
        this.getValue = () => {
            return this.serializer.serialize(this.view.state.doc);
        };
        this.handleChange = () => {
            if (!this.props.onChange)
                return;
            this.props.onChange(() => {
                return this.getValue();
            });
        };
        this.handleGoToPreviousInput = () => {
            const { onGoToPreviousInput } = this.props;
            if (onGoToPreviousInput) {
                onGoToPreviousInput();
            }
        };
        this.handleSave = () => {
            const { onSave } = this.props;
            if (onSave) {
                onSave({ done: false });
            }
        };
        this.handleSaveAndExit = () => {
            const { onSave } = this.props;
            if (onSave) {
                onSave({ done: true });
            }
        };
        this.handleEditorBlur = () => {
            this.setState({ isEditorFocused: false });
        };
        this.handleEditorFocus = () => {
            this.setState({ isEditorFocused: true });
        };
        this.handleOpenSelectionMenu = () => {
            this.setState({ blockMenuOpen: false, selectionMenuOpen: true });
        };
        this.handleCloseSelectionMenu = () => {
            this.setState({ selectionMenuOpen: false });
        };
        this.handleOpenLinkMenu = () => {
            this.setState({ blockMenuOpen: false, linkMenuOpen: true });
        };
        this.handleCloseLinkMenu = () => {
            this.setState({ linkMenuOpen: false });
        };
        this.handleOpenBlockMenu = (search) => {
            this.setState({ blockMenuOpen: true, blockMenuSearch: search });
        };
        this.handleCloseBlockMenu = () => {
            if (!this.state.blockMenuOpen)
                return;
            this.setState({ blockMenuOpen: false });
        };
        this.handleSelectRow = (index, state) => {
            this.view.dispatch(prosemirror_utils_1.selectRow(index)(state.tr));
        };
        this.handleSelectColumn = (index, state) => {
            this.view.dispatch(prosemirror_utils_1.selectColumn(index)(state.tr));
        };
        this.handleSelectTable = (state) => {
            this.view.dispatch(prosemirror_utils_1.selectTable(state.tr));
        };
        this.getDefaultHighlightKey = () => {
            return this.props.defaultHighlightKey || constants_1.DEFAULT_HIGHLIGHT_KEY;
        };
        this.getDefaultBackgroundKey = () => {
            return this.props.defaultBackgroundKey || constants_1.DEFAULT_BACKGROUND_KEY;
        };
        this.setDefaultHighlight = (defaultHighlight) => {
            this.setState((state) => (Object.assign(Object.assign({}, state), { defaultHighlight })));
            window.localStorage.setItem(this.getDefaultHighlightKey(), defaultHighlight);
        };
        this.setDefaultBackground = (defaultBackground) => {
            this.setState((state) => (Object.assign(Object.assign({}, state), { defaultBackground })));
            window.localStorage.setItem(this.getDefaultBackgroundKey(), defaultBackground);
        };
        this.getLocalStorageDefaults = () => {
            return {
                defaultHighlight: window.localStorage.getItem(this.getDefaultHighlightKey()),
                defaultBackground: window.localStorage.getItem(this.getDefaultBackgroundKey()),
            };
        };
        this.onHoverLink = () => {
        };
        this.forceUpdateContent = (newValue, options) => {
            const newState = this.createState(newValue);
            this.view.updateState(newState);
            if (options.triggerOnChange) {
                this.handleChange();
            }
        };
        this.getHeadings = () => {
            const headings = [];
            const previouslySeen = {};
            this.view.state.doc.forEach((node) => {
                if (node.type.name === "heading") {
                    const slug = headingToSlug_1.default(node);
                    let id = slug;
                    if (previouslySeen[slug] > 0) {
                        id = headingToSlug_1.default(node, previouslySeen[slug]);
                    }
                    previouslySeen[slug] =
                        previouslySeen[slug] !== undefined ? previouslySeen[slug] + 1 : 1;
                    headings.push({
                        title: node.textContent,
                        level: node.attrs.level,
                        id,
                    });
                }
            });
            return headings;
        };
        this.theme = () => {
            return this.props.theme || (this.props.dark ? theme_1.dark : theme_1.light);
        };
        this.dictionary = memoize_1.default((providedDictionary) => {
            return Object.assign(Object.assign({}, dictionary_1.default), providedDictionary);
        });
    }
    componentDidMount() {
        this.init();
        if (this.props.scrollTo) {
            this.scrollToAnchor(this.props.scrollTo);
        }
        this.calculateDir();
        const { defaultHighlight, defaultBackground } = this.getLocalStorageDefaults();
        this.setState((state) => (Object.assign(Object.assign({}, state), { defaultHighlight,
            defaultBackground })));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.readOnly !== this.props.readOnly) {
            this.view.update(Object.assign(Object.assign({}, this.view.props), { editable: () => !this.props.readOnly }));
        }
        if (this.props.scrollTo && this.props.scrollTo !== prevProps.scrollTo) {
            this.scrollToAnchor(this.props.scrollTo);
        }
        if (prevProps.dir !== this.props.dir) {
            this.calculateDir();
        }
        if (!this.isBlurred &&
            !this.state.isEditorFocused &&
            !this.state.blockMenuOpen &&
            !this.state.linkMenuOpen &&
            !this.state.selectionMenuOpen) {
            this.isBlurred = true;
            if (this.props.onBlur) {
                this.props.onBlur();
            }
        }
        if (this.isBlurred &&
            (this.state.isEditorFocused ||
                this.state.blockMenuOpen ||
                this.state.linkMenuOpen ||
                this.state.selectionMenuOpen)) {
            this.isBlurred = false;
            if (this.props.onFocus) {
                this.props.onFocus();
            }
        }
    }
    init() {
        this.extensions = this.createExtensions(this.props.customExtensions);
        this.nodes = this.createNodes();
        this.marks = this.createMarks();
        this.schema = this.createSchema();
        this.plugins = this.createPlugins();
        this.rulePlugins = this.createRulePlugins();
        this.keymaps = this.createKeymaps();
        this.serializer = this.createSerializer();
        this.mdParser = this.createMDParser();
        this.domParser = this.createDOMParser();
        this.pasteParser = this.createPasteParser();
        this.inputRules = this.createInputRules();
        this.nodeViews = this.createNodeViews();
        this.view = this.createView();
        this.commands = this.createCommands();
    }
    createExtensions(customExtensions) {
        const dictionary = this.dictionary(this.props.dictionary);
        const extensions = customExtensions ? [
            ...customExtensions,
            new Link_1.default({
                onKeyboardShortcut: this.handleOpenLinkMenu,
                onClickLink: this.props.onClickLink,
                onClickHashtag: this.props.onClickHashtag,
                onHoverLink: this.props.onHoverLink,
            }),
            new Keys_1.default({
                onBlur: this.handleEditorBlur,
                onFocus: this.handleEditorFocus,
                onSave: this.handleSave,
                onSaveAndExit: this.handleSaveAndExit,
                onCancel: this.props.onCancel,
            }),
            new EmojiTrigger_1.default({
                onOpen: (search) => {
                    this.setState({ emojiMenuOpen: true, blockMenuSearch: search });
                },
                onClose: () => {
                    this.setState({ emojiMenuOpen: false });
                },
            }),
            new GoToPreviousInputTrigger_1.default({
                onGoToPreviousInput: this.handleGoToPreviousInput,
            }),
        ] : [
            new Doc_1.default(),
            new HardBreak_1.default(),
            new Paragraph_1.default(),
            new Blockquote_1.default(),
            new CodeBlock_1.default({
                dictionary,
                onShowToast: this.props.onShowToast,
            }),
            new CodeFence_1.default({
                dictionary,
                onShowToast: this.props.onShowToast,
            }),
            new Emoji_1.default(),
            new Text_1.default(),
            new CheckboxList_1.default(),
            new CheckboxItem_1.default(),
            new BulletList_1.default(),
            new Embed_1.default({
                embeds: this.props.embeds,
            }),
            new ListItem_1.default(),
            new Notice_1.default({
                dictionary,
            }),
            new Heading_1.default({
                dictionary,
                onShowToast: this.props.onShowToast,
                offset: this.props.headingsOffset,
            }),
            new HorizontalRule_1.default(),
            new Image_1.default({
                dictionary,
                uploadImage: this.props.uploadImage,
                onImageUploadStart: this.props.onImageUploadStart,
                onImageUploadStop: this.props.onImageUploadStop,
                onShowToast: this.props.onShowToast,
            }),
            new Table_1.default(),
            new TableCell_1.default({
                onSelectTable: this.handleSelectTable,
                onSelectRow: this.handleSelectRow,
            }),
            new TableHeadCell_1.default({
                onSelectColumn: this.handleSelectColumn,
            }),
            new TableRow_1.default(),
            new backgrounds_1.BlueBackground(),
            new backgrounds_1.RedBackground(),
            new backgrounds_1.OrangeBackground(),
            new backgrounds_1.YellowBackground(),
            new backgrounds_1.GreenBackground(),
            new OrangeHighlight_1.default(),
            new YellowHighlight_1.default(),
            new BlueHighlight_1.default(),
            new GreenHighlight_1.default(),
            new RedHighlight_1.default(),
            new Bold_1.default(),
            new Code_1.default(),
            new Italic_1.default(),
            new Placeholder_1.default(),
            new Underline_1.default(),
            new Link_1.default({
                onKeyboardShortcut: this.handleOpenLinkMenu,
                onClickLink: this.props.onClickLink,
                onClickHashtag: this.props.onClickHashtag,
                onHoverLink: this.props.onHoverLink,
            }),
            new Strikethrough_1.default(),
            new OrderedList_1.default(),
            new History_1.default(),
            new Folding_1.default(),
            new SmartText_1.default(),
            new TrailingNode_1.default(),
            new PasteHandler_1.default(),
            new Keys_1.default({
                onBlur: this.handleEditorBlur,
                onFocus: this.handleEditorFocus,
                onSave: this.handleSave,
                onSaveAndExit: this.handleSaveAndExit,
                onCancel: this.props.onCancel,
            }),
            new BlockMenuTrigger_1.default({
                dictionary,
                onOpen: this.handleOpenBlockMenu,
                onClose: this.handleCloseBlockMenu,
            }),
            new EmojiTrigger_1.default({
                onOpen: (search) => {
                    this.setState({ emojiMenuOpen: true, blockMenuSearch: search });
                },
                onClose: () => {
                    this.setState({ emojiMenuOpen: false });
                },
            }),
            new GoToPreviousInputTrigger_1.default({
                onGoToPreviousInput: this.handleGoToPreviousInput,
            }),
            new Placeholder_2.default({
                placeholder: this.props.placeholder,
            }),
            new MaxLength_1.default({
                maxLength: this.props.maxLength,
            }),
        ];
        return new ExtensionManager_1.default(this.props.disableExtensions ?
            extensions.filter((extension) => {
                return !this.props.disableExtensions.includes(extension.name);
            }) : extensions, this);
    }
    createPlugins() {
        return this.extensions.plugins;
    }
    createRulePlugins() {
        return this.extensions.rulePlugins;
    }
    createKeymaps() {
        return this.extensions.keymaps({
            schema: this.schema,
        });
    }
    createInputRules() {
        return this.extensions.inputRules({
            schema: this.schema,
        });
    }
    createNodeViews() {
        return this.extensions.extensions
            .filter((extension) => extension.component)
            .reduce((nodeViews, extension) => {
            const nodeView = (node, view, getPos, decorations) => {
                return new ComponentView_1.default(extension.component, {
                    editor: this,
                    extension,
                    node,
                    view,
                    getPos,
                    decorations,
                });
            };
            return Object.assign(Object.assign({}, nodeViews), { [extension.name]: nodeView });
        }, {});
    }
    createCommands() {
        return this.extensions.commands({
            schema: this.schema,
            view: this.view,
        });
    }
    createNodes() {
        return this.extensions.nodes;
    }
    createMarks() {
        return this.extensions.marks;
    }
    createSchema() {
        return new prosemirror_model_1.Schema({
            nodes: this.nodes,
            marks: this.marks,
        });
    }
    createSerializer() {
        return this.extensions.serializer();
    }
    createMDParser() {
        return this.extensions.parser({
            schema: this.schema,
            plugins: this.rulePlugins,
        });
    }
    createDOMParser() {
        return prosemirror_model_1.DOMParser.fromSchema(this.schema);
    }
    createPasteParser() {
        return this.extensions.parser({
            schema: this.schema,
            rules: { linkify: true },
            plugins: this.rulePlugins,
        });
    }
    createState(value) {
        const doc = this.createDocument(value || this.props.defaultValue);
        return prosemirror_state_1.EditorState.create({
            schema: this.schema,
            doc,
            plugins: [
                ...this.plugins,
                ...this.keymaps,
                prosemirror_dropcursor_1.dropCursor({ color: this.theme().cursor }),
                prosemirror_gapcursor_1.gapCursor(),
                prosemirror_inputrules_1.inputRules({ rules: this.inputRules }),
                prosemirror_keymap_1.keymap({ Tab: () => true }),
                prosemirror_keymap_1.keymap(prosemirror_commands_1.baseKeymap),
            ],
        });
    }
    createDocument(content) {
        var _a;
        if (this.props.parseAsHTML) {
            return this.parseHtmlContent(content);
        }
        return (_a = this.mdParser.parse(content)) !== null && _a !== void 0 ? _a : undefined;
    }
    parseHtmlContent(content) {
        const domNode = document.createElement("div");
        domNode.innerHTML = content;
        try {
            return this.domParser.parse(domNode);
        }
        catch (error) {
            domNode.innerHTML = domHelpers_1.replaceHeaderByStrong(content);
            return this.domParser.parse(domNode);
        }
    }
    createView() {
        if (!this.element) {
            throw new Error("createView called before ref available");
        }
        const isEditingCheckbox = (tr) => {
            return tr.steps.some((step) => {
                var _a, _b, _c;
                return ((_c = (_b = (_a = step.slice) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.firstChild) === null || _c === void 0 ? void 0 : _c.type.name) ===
                    this.schema.nodes.checkbox_item.name;
            });
        };
        const self = this;
        const view = new prosemirror_view_1.EditorView(this.element, {
            state: this.createState(this.props.defaultValue),
            editable: () => !this.props.readOnly,
            nodeViews: this.nodeViews,
            handleDOMEvents: this.props.handleDOMEvents,
            dispatchTransaction: function (transaction) {
                const { state, transactions } = this.state.applyTransaction(transaction);
                this.updateState(state);
                if (transactions.some((tr) => tr.docChanged) &&
                    (!self.props.readOnly ||
                        (self.props.readOnlyWriteCheckboxes &&
                            transactions.some(isEditingCheckbox)))) {
                    self.handleChange();
                }
                self.calculateDir();
                self.forceUpdate();
            },
        });
        view.dom.setAttribute("role", "textbox");
        return view;
    }
    scrollToAnchor(hash) {
        if (!hash)
            return;
        try {
            const element = document.querySelector(hash);
            if (element)
                element.scrollIntoView({ behavior: "smooth" });
        }
        catch (err) {
            console.warn(`Attempted to scroll to invalid hash: ${hash}`, err);
        }
    }
    render() {
        const { dir, readOnly, readOnlyWriteCheckboxes, style, className, onKeyDown, fontScale, } = this.props;
        const { isRTL } = this.state;
        const dictionary = this.dictionary(this.props.dictionary);
        const deviceType = react_device_detect_1.isMacOs ? "mac" : react_device_detect_1.isWindows ? "windows" : undefined;
        return (React.createElement(Flex_1.default, { onKeyDown: onKeyDown, style: style, className: className, align: "flex-start", justify: "center", dir: dir, column: true, spellCheck: typeof this.props.spellCheck === 'boolean' ?
                this.props.spellCheck : true },
            React.createElement(styled_components_1.ThemeProvider, { theme: this.theme() },
                React.createElement(React.Fragment, null,
                    React.createElement(editor_1.StyledEditor, { ref: (ref) => (this.element = ref), fontScale: fontScale !== null && fontScale !== void 0 ? fontScale : 1, rtl: isRTL, readOnly: readOnly, readOnlyWriteCheckboxes: readOnlyWriteCheckboxes }),
                    !readOnly && this.view && (React.createElement(React.Fragment, null,
                        React.createElement(SelectionToolbar_1.default, { view: this.view, dictionary: dictionary, commands: this.commands, rtl: isRTL, isTemplate: this.props.template === true, onOpen: this.handleOpenSelectionMenu, onClose: this.handleCloseSelectionMenu, onSearchLink: this.props.onSearchLink, onClickLink: this.props.onClickLink, onCreateLink: this.props.onCreateLink, isDarkMode: this.props.dark, deviceType: deviceType, defaultHighlight: this.state.defaultHighlight || constants_1.DEFAULT_HIGHLIGHT, defaultBackground: this.state.defaultBackground || constants_1.DEFAULT_BACKGROUND, setDefaultHighlight: this.setDefaultHighlight, setDefaultBackground: this.setDefaultBackground }),
                        React.createElement(LinkToolbar_1.default, { view: this.view, dictionary: dictionary, isActive: this.state.linkMenuOpen, onCreateLink: this.props.onCreateLink, onSearchLink: this.props.onSearchLink, onClickLink: this.props.onClickLink, onShowToast: this.props.onShowToast, onClose: this.handleCloseLinkMenu }),
                        !this.props.disableEmojiMenu ? (React.createElement(EmojiMenu_1.default, { view: this.view, commands: this.commands, dictionary: dictionary, rtl: isRTL, isActive: this.state.emojiMenuOpen, search: this.state.blockMenuSearch, onClose: () => this.setState({ emojiMenuOpen: false }) })) : '',
                        !this.props.disableBlockMenu ? (React.createElement(BlockMenu_1.default, { view: this.view, commands: this.commands, dictionary: dictionary, rtl: isRTL, isActive: this.state.blockMenuOpen, search: this.state.blockMenuSearch, onClose: this.handleCloseBlockMenu, uploadImage: this.props.uploadImage, onLinkToolbarOpen: this.handleOpenLinkMenu, onImageUploadStart: this.props.onImageUploadStart, onImageUploadStop: this.props.onImageUploadStop, onShowToast: this.props.onShowToast, embeds: this.props.embeds, isDarkMode: this.props.dark, deviceType: deviceType })) : ''))))));
    }
}
RichMarkdownEditor.defaultProps = {
    defaultValue: "",
    dir: "auto",
    fontScale: 1,
    placeholder: "Write something nice…",
    onImageUploadStart: () => {
    },
    onImageUploadStop: () => {
    },
    onClickLink: (href) => {
        window.open(href, "_blank");
    },
    embeds: [],
    extensions: [],
};
exports.default = RichMarkdownEditor;
//# sourceMappingURL=index.js.map