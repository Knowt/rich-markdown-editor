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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapper = void 0;
const React = __importStar(require("react"));
const capitalize_1 = __importDefault(require("lodash/capitalize"));
const react_portal_1 = require("react-portal");
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
const styled_components_1 = __importDefault(require("styled-components"));
const types_1 = require("../types");
const Input_1 = __importDefault(require("./Input"));
const VisuallyHidden_1 = __importDefault(require("./VisuallyHidden"));
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const filterExcessSeparators_1 = __importDefault(require("../lib/filterExcessSeparators"));
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const SSR = typeof window === "undefined";
const defaultPosition = {
    left: -1000,
    top: 0,
    bottom: undefined,
    isAbove: false,
};
class CommandMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.menuRef = React.createRef();
        this.inputRef = React.createRef();
        this.state = {
            left: -1000,
            top: 0,
            bottom: undefined,
            isAbove: false,
            selectedIndex: 0,
            insertItem: undefined,
        };
        this.handleKeyDown = (event) => {
            if (!this.props.isActive)
                return;
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                const item = this.filtered[this.state.selectedIndex];
                if (item) {
                    this.insertItem(item);
                }
                else {
                    this.props.onClose();
                }
            }
            if (event.key === "ArrowUp" ||
                (event.key === "Tab" && event.shiftKey) ||
                (event.ctrlKey && event.key === "p")) {
                event.preventDefault();
                event.stopPropagation();
                if (this.filtered.length) {
                    const prevIndex = this.state.selectedIndex - 1;
                    const prev = this.filtered[prevIndex];
                    this.setState({
                        selectedIndex: Math.max(0, prev && prev.name === "separator" ? prevIndex - 1 : prevIndex),
                    });
                }
                else {
                    this.close();
                }
            }
            if (event.key === "ArrowDown" ||
                (event.key === "Tab" && !event.shiftKey) ||
                (event.ctrlKey && event.key === "n")) {
                event.preventDefault();
                event.stopPropagation();
                if (this.filtered.length) {
                    const total = this.filtered.length - 1;
                    const nextIndex = this.state.selectedIndex + 1;
                    const next = this.filtered[nextIndex];
                    this.setState({
                        selectedIndex: Math.min(next && next.name === "separator" ? nextIndex + 1 : nextIndex, total),
                    });
                }
                else {
                    this.close();
                }
            }
            if (event.key === "Escape") {
                this.close();
            }
        };
        this.insertItem = (item) => {
            var _a, _b;
            switch (item.name) {
                case "image":
                    return this.triggerImagePick();
                case "embed":
                    return this.triggerLinkInput(item);
                case "link": {
                    this.clearSearch();
                    this.props.onClose();
                    (_b = (_a = this.props).onLinkToolbarOpen) === null || _b === void 0 ? void 0 : _b.call(_a);
                    return;
                }
                default:
                    this.insertBlock(item);
            }
        };
        this.close = () => {
            this.props.onClose();
            this.props.view.focus();
        };
        this.handleLinkInputKeydown = (event) => {
            if (!this.props.isActive)
                return;
            if (!this.state.insertItem)
                return;
            if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                const href = event.currentTarget.value;
                const matches = this.state.insertItem.matcher(href);
                if (!matches && this.props.onShowToast) {
                    this.props.onShowToast(this.props.dictionary.embedInvalidLink, types_1.ToastType.Error);
                    return;
                }
                this.insertBlock({
                    name: "embed",
                    attrs: {
                        href,
                    },
                });
            }
            if (event.key === "Escape") {
                this.props.onClose();
                this.props.view.focus();
            }
        };
        this.handleLinkInputPaste = (event) => {
            if (!this.props.isActive)
                return;
            if (!this.state.insertItem)
                return;
            const href = event.clipboardData.getData("text/plain");
            const matches = this.state.insertItem.matcher(href);
            if (matches) {
                event.preventDefault();
                event.stopPropagation();
                this.insertBlock({
                    name: "embed",
                    attrs: {
                        href,
                    },
                });
            }
        };
        this.triggerImagePick = () => {
            if (this.inputRef.current) {
                this.inputRef.current.click();
            }
        };
        this.triggerLinkInput = (item) => {
            this.setState({ insertItem: item });
        };
        this.handleImagePicked = (event) => {
            const files = getDataTransferFiles_1.default(event);
            const { view, uploadImage, onImageUploadStart, onImageUploadStop, onShowToast, } = this.props;
            const { state } = view;
            const parent = prosemirror_utils_1.findParentNode((node) => !!node)(state.selection);
            this.clearSearch();
            if (!uploadImage) {
                throw new Error("uploadImage prop is required to replace images");
            }
            if (parent) {
                insertFiles_1.default(view, event, parent.pos, files, {
                    uploadImage,
                    onImageUploadStart,
                    onImageUploadStop,
                    onShowToast,
                    dictionary: this.props.dictionary,
                });
            }
            if (this.inputRef.current) {
                this.inputRef.current.value = "";
            }
            this.props.onClose();
        };
        this.clearSearch = () => {
            this.props.onClearSearch();
        };
    }
    componentDidMount() {
        if (!SSR) {
            window.addEventListener("keydown", this.handleKeyDown);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.search !== this.props.search ||
            nextProps.isActive !== this.props.isActive ||
            nextState !== this.state);
    }
    componentDidUpdate(prevProps) {
        if (!prevProps.isActive && this.props.isActive) {
            const position = this.calculatePosition(this.props);
            this.setState(Object.assign({ insertItem: undefined, selectedIndex: 0 }, position));
        }
        else if (prevProps.search !== this.props.search) {
            this.setState({ selectedIndex: 0 });
        }
    }
    componentWillUnmount() {
        if (!SSR) {
            window.removeEventListener("keydown", this.handleKeyDown);
        }
    }
    insertBlock(item) {
        this.clearSearch();
        const command = this.props.commands[item.name];
        if (command) {
            command(item.attrs);
        }
        else {
            this.props.commands[`create${capitalize_1.default(item.name)}`](item.attrs);
        }
        this.props.onClose();
    }
    get caretPosition() {
        const selection = window.document.getSelection();
        if (!selection || !selection.anchorNode || !selection.focusNode) {
            return {
                top: 0,
                left: 0,
            };
        }
        const range = window.document.createRange();
        range.setStart(selection.anchorNode, selection.anchorOffset);
        range.setEnd(selection.focusNode, selection.focusOffset);
        const rects = range.getClientRects();
        if (rects.length === 0) {
            if (range.startContainer && range.collapsed) {
                range.selectNodeContents(range.startContainer);
            }
        }
        const rect = range.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
        };
    }
    calculatePosition(props) {
        const { view } = props;
        const { selection } = view.state;
        let startPos;
        try {
            startPos = view.coordsAtPos(selection.from);
        }
        catch (err) {
            console.warn(err);
            return defaultPosition;
        }
        const domAtPos = view.domAtPos.bind(view);
        const ref = this.menuRef.current;
        const offsetHeight = ref ? ref.offsetHeight : 0;
        const node = prosemirror_utils_1.findDomRefAtPos(selection.from, domAtPos);
        const paragraph = { node };
        if (!props.isActive ||
            !paragraph.node ||
            !paragraph.node.getBoundingClientRect ||
            SSR) {
            return defaultPosition;
        }
        const { left } = this.caretPosition;
        const { top, bottom, right } = paragraph.node.getBoundingClientRect();
        const margin = 24;
        let leftPos = left + window.scrollX;
        if (props.rtl && ref) {
            leftPos = right - ref.scrollWidth;
        }
        if (startPos.top - offsetHeight > margin) {
            return {
                left: leftPos,
                top: undefined,
                bottom: window.innerHeight - top - window.scrollY,
                isAbove: false,
            };
        }
        else {
            return {
                left: leftPos,
                top: bottom + window.scrollY,
                bottom: undefined,
                isAbove: true,
            };
        }
    }
    get filtered() {
        const { embeds = [], search = "", uploadImage, commands, filterable = true, } = this.props;
        let items = this.props.items;
        const embedItems = [];
        for (const embed of embeds) {
            if (embed.title && embed.icon) {
                embedItems.push(Object.assign(Object.assign({}, embed), { name: "embed" }));
            }
        }
        if (embedItems.length) {
            items.push({
                name: "separator",
            });
            items = items.concat(embedItems);
        }
        const filtered = items.filter((item) => {
            if (item.name === "separator")
                return true;
            if (item.name &&
                !commands[item.name] &&
                !commands[`create${capitalize_1.default(item.name)}`]) {
                return false;
            }
            if (!uploadImage && item.name === "image")
                return false;
            if (!search)
                return !item.defaultHidden;
            const n = search.toLowerCase();
            if (!filterable) {
                return item;
            }
            return ((item.title || "").toLowerCase().includes(n) ||
                (item.keywords || "").toLowerCase().includes(n));
        });
        return filterExcessSeparators_1.default(filtered);
    }
    render() {
        const { dictionary, isActive, uploadImage } = this.props;
        const items = this.filtered;
        const _a = this.state, { insertItem } = _a, positioning = __rest(_a, ["insertItem"]);
        return (React.createElement(react_portal_1.Portal, null,
            React.createElement(exports.Wrapper, Object.assign({ active: isActive, ref: this.menuRef }, positioning),
                insertItem ? (React.createElement(LinkInputWrapper, null,
                    React.createElement(LinkInput, { type: "text", placeholder: insertItem.title
                            ? dictionary.pasteLinkWithTitle(insertItem.title)
                            : dictionary.pasteLink, onKeyDown: this.handleLinkInputKeydown, onPaste: this.handleLinkInputPaste, autoFocus: true }))) : (React.createElement(List, null,
                    items.map((item, index) => {
                        if (item.name === "separator") {
                            return (React.createElement(ListItem, { key: index },
                                React.createElement("hr", null)));
                        }
                        const selected = index === this.state.selectedIndex && isActive;
                        if (!item.title) {
                            return null;
                        }
                        return (React.createElement(ListItem, { key: index }, this.props.renderMenuItem(item, index, {
                            selected,
                            onClick: () => this.insertItem(item),
                        })));
                    }),
                    items.length === 0 && (React.createElement(ListItem, null,
                        React.createElement(Empty, null, dictionary.noResults))))),
                uploadImage && (React.createElement(VisuallyHidden_1.default, null,
                    React.createElement("input", { type: "file", ref: this.inputRef, onChange: this.handleImagePicked, accept: "image/*" }))))));
    }
}
const LinkInputWrapper = styled_components_1.default.div `
  margin: 8px;
`;
const LinkInput = styled_components_1.default(Input_1.default) `
  height: 36px;
  width: 100%;
  color: ${(props) => props.theme.blockToolbarText};
`;
const List = styled_components_1.default.ol `
  list-style: none;
  text-align: left;
  height: 100%;
  padding: 8px 0;
  margin: 0;
`;
const ListItem = styled_components_1.default.li `
  padding: 0;
  margin: 0;
`;
const Empty = styled_components_1.default.div `
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
  font-size: 14px;
  height: 36px;
  padding: 0 16px;
`;
exports.Wrapper = styled_components_1.default.div `
  color: ${(props) => props.theme.text};
  font-family: ${(props) => props.theme.fontFamilyMono};
  position: absolute;
  z-index: ${(props) => props.theme.zIndex + 100};
  ${(props) => props.top !== undefined && `top: ${props.top}px`};
  ${(props) => props.bottom !== undefined && `bottom: ${props.bottom}px`};
  left: ${(props) => props.left}px;
  background-color: ${(props) => props.theme.blockToolbarBackground};
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 8%) 0px 0.4rem 1.6rem 0px;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;
  width: 300px;
  max-height: 246px;
  overflow: hidden;
  overflow-y: auto;
  * {
    box-sizing: border-box;
  }

  &::-webkit-scrollbar {
    background: transparent;
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: rgba(220, 220, 220, 0.6);
  }

  hr {
    border: 0;
    height: 0;
    margin: 0;
    border-top: 1px solid ${(props) => props.theme.blockToolbarDivider};
  }

  ${({ active, isAbove }) => active &&
    `
    transform: translateY(${isAbove ? "6px" : "-6px"}) scale(1);
    pointer-events: all;
    opacity: 1;
  `};

  @media print {
    display: none;
  }
`;
exports.default = CommandMenu;
//# sourceMappingURL=CommandMenu.js.map