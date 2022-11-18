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
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const domHelpers_1 = require("../domHelpers");
const SSR = typeof window === "undefined";
const defaultMenuPosition = {
    left: -1000,
    top: 0,
    bottom: undefined,
    updatedAt: Date.now(),
};
const defaultMenuMaxHeight = 250;
const SAFE_MARGIN_Y = 50;
const SAFE_MARGIN_X = 10;
class KnowtCommandMenu extends React.Component {
    constructor(props) {
        super(props);
        this.menuRef = React.createRef();
        this.nestedMenuRef = React.createRef();
        this.listRef = React.createRef();
        this.inputRef = React.createRef();
        this.menuTitleRef = React.createRef();
        this.primaryItemsRef = [];
        this.state = {
            menu1Position: defaultMenuPosition,
            menu2Position: defaultMenuPosition,
            menu1MaxHeight: defaultMenuMaxHeight,
            insertItem: undefined,
            selectedIndex: 0,
            nestedSelectedIndex: null,
            searchItemsSelectedIndex: 0,
            nestedMenuOpen: false,
        };
        this.handleClick = (event) => {
            var _a, _b;
            if (!this.props.isActive) {
                return;
            }
            const now = Date.now();
            const menuOpenedAt = this.state.menu1Position.updatedAt;
            const menuOpenedFor = now - menuOpenedAt;
            if (menuOpenedFor < 200) {
                return;
            }
            if (!((_a = this.menuRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) &&
                !((_b = this.nestedMenuRef.current) === null || _b === void 0 ? void 0 : _b.contains(event.target))) {
                this.close();
            }
        };
        this.handleKeyDown = (e) => {
            var _a;
            if (!this.props.isActive)
                return;
            const stateKey = this.props.search
                ? "searchItemsSelectedIndex"
                : this.state.nestedSelectedIndex === null
                    ? "selectedIndex"
                    : "nestedSelectedIndex";
            const currentArray = stateKey === "searchItemsSelectedIndex"
                ? this.filtered.map(({ items }) => items).flat()
                : stateKey === "nestedSelectedIndex"
                    ? this.filtered[this.state.selectedIndex].items
                    : this.filtered;
            const currentIndex = (_a = this.state[stateKey]) !== null && _a !== void 0 ? _a : 0;
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                const item = currentArray[currentIndex];
                if (item) {
                    if (stateKey === "selectedIndex") {
                        this.onGroupSelect(this.state.selectedIndex);
                    }
                    else {
                        this.insertItem(item);
                    }
                }
                else {
                    this.close();
                }
            }
            const isUpKey = e.key === "ArrowUp" ||
                (e.key === "Tab" && e.shiftKey) ||
                (e.ctrlKey && e.key === "p");
            const isDownKey = e.key === "ArrowDown" ||
                (e.key === "Tab" && !e.shiftKey) ||
                (e.ctrlKey && e.key === "n");
            if (isUpKey || isDownKey) {
                e.preventDefault();
                e.stopPropagation();
                const newIndex = isUpKey
                    ? currentIndex - 1 < 0
                        ? currentArray.length - 1
                        : currentIndex - 1
                    : currentIndex + 1 === currentArray.length
                        ? 0
                        : currentIndex + 1;
                if (currentArray.length) {
                    if (stateKey === "searchItemsSelectedIndex") {
                        this.setState({ searchItemsSelectedIndex: newIndex });
                    }
                    else if (stateKey === "nestedSelectedIndex") {
                        this.setState({ nestedSelectedIndex: newIndex });
                    }
                    else {
                        this.setState({ selectedIndex: newIndex });
                        if (this.state.nestedMenuOpen) {
                            this.updateMenu2Position(newIndex);
                        }
                    }
                }
                else {
                    this.close();
                }
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                e.stopPropagation();
                this.onGroupSelect(this.state.selectedIndex);
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                e.stopPropagation();
                this.closeNestedMenu();
            }
            if (e.key === "Escape") {
                this.close();
            }
        };
        this.insertItem = (item) => {
            var _a, _b;
            this.clearSearch();
            if (item.customOnClick) {
                this.close();
                item.customOnClick();
                return;
            }
            switch (item.name) {
                case "image":
                    return this.triggerImagePick();
                case "embed":
                    return this.triggerLinkInput(item);
                case "link": {
                    this.close();
                    (_b = (_a = this.props).onLinkToolbarOpen) === null || _b === void 0 ? void 0 : _b.call(_a);
                    return;
                }
                default:
                    this.insertBlock(item);
            }
        };
        this.close = () => {
            this.closeNestedMenu();
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
                this.close();
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
            this.close();
        };
        this.clearSearch = () => {
            if (this.props.search === undefined) {
                return this.props.onClearSearch(0);
            }
            this.props.onClearSearch(this.props.search.length + 1);
        };
    }
    componentDidMount() {
        if (!SSR) {
            window.addEventListener("keydown", this.handleKeyDown);
            window.addEventListener("click", this.handleClick);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.search !== this.props.search ||
            nextProps.isActive !== this.props.isActive ||
            nextState !== this.state);
    }
    componentDidUpdate(prevProps) {
        if ((this.props.isActive && !prevProps.isActive) ||
            this.props.search !== prevProps.search) {
            this.updateMenu1Position();
            this.setState({
                insertItem: undefined,
                selectedIndex: 0,
                searchItemsSelectedIndex: 0,
                nestedSelectedIndex: null,
                nestedMenuOpen: false,
            });
        }
        if (prevProps.isActive && !this.props.isActive) {
            this.closeNestedMenu();
        }
    }
    componentWillUnmount() {
        if (!SSR) {
            window.removeEventListener("keydown", this.handleKeyDown);
            window.removeEventListener("click", this.handleClick);
        }
    }
    closeNestedMenu() {
        this.setState({
            nestedMenuOpen: false,
            menu2Position: defaultMenuPosition,
            nestedSelectedIndex: null,
        });
    }
    insertBlock(item) {
        const command = this.props.commands[item.name];
        if (command) {
            command(item.attrs);
        }
        else {
            this.props.commands[`create${capitalize_1.default(item.name)}`](item.attrs);
        }
        this.close();
    }
    getCaretPosition() {
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
    onGroupSelect(groupIndex) {
        this.setState({
            selectedIndex: groupIndex,
            nestedSelectedIndex: 0,
            nestedMenuOpen: true,
        });
        this.updateMenu2Position(groupIndex);
    }
    updateMenu2Position(groupIndex) {
        const menuHeight = this.getMenu2Height(groupIndex);
        const { right, top: _top } = this.primaryItemsRef[groupIndex].getBoundingClientRect();
        const bottomToBottomDistance = window.innerHeight - (_top + menuHeight + SAFE_MARGIN_Y);
        const left = right + window.scrollX + SAFE_MARGIN_X;
        const offset = bottomToBottomDistance > 0 ? 0 : bottomToBottomDistance;
        this.setState({
            menu2Position: {
                left,
                top: _top + window.scrollY + offset,
                bottom: undefined,
                updatedAt: Date.now(),
            },
        });
    }
    updateMenu1Position() {
        if (this.props.search) {
            this.updateSearchMenuMaxHeight();
        }
        else {
            this.setState({
                menu1Position: this.getMenu1InitialPosition(),
                menu1MaxHeight: defaultMenuMaxHeight,
            });
        }
    }
    updateSearchMenuMaxHeight() {
        const searchMenuHeight = this.getSearchMenuHeight();
        const menuSpace = searchMenuHeight + SAFE_MARGIN_Y;
        const { top = 0, bottom = 0, isAbove } = this.state.menu1Position;
        const menuClippedHeight = isAbove
            ? top - window.scrollY + menuSpace - window.innerHeight
            : bottom + window.scrollY + menuSpace - window.innerHeight;
        this.setState({ menu1MaxHeight: searchMenuHeight - menuClippedHeight });
    }
    getMenu1InitialPosition() {
        const { view, isActive, rtl } = this.props;
        const { selection } = view.state;
        let startPos;
        try {
            startPos = view.coordsAtPos(selection.from);
        }
        catch (err) {
            console.warn(err);
            return defaultMenuPosition;
        }
        const menuRef = this.menuRef.current;
        const menuHeight = menuRef ? menuRef.offsetHeight : 0;
        const paragraph = {
            node: prosemirror_utils_1.findDomRefAtPos(selection.from, view.domAtPos.bind(view)),
        };
        if (!isActive ||
            !paragraph.node ||
            !paragraph.node.getBoundingClientRect ||
            SSR) {
            return defaultMenuPosition;
        }
        const { top, bottom, right } = paragraph.node.getBoundingClientRect();
        const left = rtl && menuRef
            ? right - menuRef.scrollWidth
            : this.getCaretPosition().left + window.scrollX;
        if (startPos.top + menuHeight + SAFE_MARGIN_Y < window.innerHeight) {
            return {
                left,
                top: bottom + window.scrollY,
                bottom: undefined,
                isAbove: true,
                updatedAt: Date.now(),
            };
        }
        else {
            return {
                left,
                top: undefined,
                bottom: window.innerHeight - top - window.scrollY,
                isAbove: false,
                updatedAt: Date.now(),
            };
        }
    }
    getMenu2Height(groupIndex) {
        const contentHeight = this.getGroupHeight(this.filtered[groupIndex]);
        const menuPaddingY = domHelpers_1.getStyleValue(this.listRef.current, "paddingBlock") * 2;
        return contentHeight + menuPaddingY;
    }
    getSearchMenuHeight() {
        let searchMenuHeight = 0;
        searchMenuHeight +=
            domHelpers_1.getStyleValue(this.listRef.current, "rowGap") *
                (this.filtered.length - 1);
        searchMenuHeight += domHelpers_1.getStyleValue(this.listRef.current, "paddingBlock") * 2;
        return this.filtered.reduce((acc, group) => (acc += this.getGroupHeight(group)), searchMenuHeight);
    }
    getGroupHeight(group) {
        var _a, _b;
        const titleHeight = ((_a = this.menuTitleRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
        const itemsHeight = group.items.length * (((_b = this.primaryItemsRef[0]) === null || _b === void 0 ? void 0 : _b.offsetHeight) || 0);
        return titleHeight + itemsHeight;
    }
    get filtered() {
        if (!this.props.search) {
            return this.props.visibleGroups;
        }
        let exactMatchGroupName, exactMatchItemName;
        let filteredGroups = this.props.allGroups
            .map((group) => {
            const filteredItems = group.items.filter((item) => {
                var _a;
                const { name, title, keywords, searchKeyword, customOnClick } = item;
                if (!this.props.filterable)
                    return true;
                if (name &&
                    !customOnClick &&
                    !this.props.commands[name] &&
                    !this.props.commands[`create${capitalize_1.default(name)}`]) {
                    return false;
                }
                if (!this.props.uploadImage && name === "image")
                    return false;
                if (searchKeyword &&
                    (searchKeyword === null || searchKeyword === void 0 ? void 0 : searchKeyword.toLowerCase()) === ((_a = this.props.search) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                    exactMatchGroupName = group.groupData.name;
                    exactMatchItemName = item.title;
                    return true;
                }
                return [group.groupData.name, title, keywords, searchKeyword].some((str) => { var _a; return str === null || str === void 0 ? void 0 : str.toLowerCase().includes((_a = this.props.search) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
            });
            return Object.assign(Object.assign({}, group), { items: filteredItems });
        })
            .filter(({ items }) => items.length);
        if (!exactMatchGroupName)
            return filteredGroups;
        filteredGroups = this.moveArrayItemToTop(filteredGroups, filteredGroups.findIndex((group) => group.groupData.name === exactMatchGroupName));
        filteredGroups[0].items = this.moveArrayItemToTop(filteredGroups[0].items, filteredGroups[0].items.findIndex((item) => item.title === exactMatchItemName));
        return filteredGroups;
    }
    moveArrayItemToTop(array, index) {
        if (index === -1)
            return array;
        const newArray = [...array];
        newArray.splice(index, 1);
        newArray.unshift(array[index]);
        return newArray;
    }
    renderGroups() {
        return this.filtered.map((item, index) => {
            return this.props.renderGroupMenuItem(item, index, (node) => {
                this.primaryItemsRef[index] = node;
            }, {
                selected: index === this.state.selectedIndex && this.props.isActive,
                onClick: () => this.onGroupSelect(index),
            });
        });
    }
    renderSearchResults() {
        let currentIndex = 0;
        return this.filtered.map((group) => {
            return (React.createElement("div", { key: group.groupData.name },
                React.createElement(MenuTitle, null, group.groupData.name),
                group.items.map((item, index) => {
                    const itemIndex = currentIndex++;
                    return this.props.renderMenuItem(item, index, (node) => {
                        this.primaryItemsRef[itemIndex] = node;
                    }, {
                        selected: itemIndex === this.state.searchItemsSelectedIndex,
                        onClick: () => this.insertItem(item),
                    });
                })));
        });
    }
    render() {
        var _a;
        const { dictionary, isActive, uploadImage } = this.props;
        const selectedGroup = this.filtered[this.state.selectedIndex];
        let id = "block-menu-container";
        if (!isActive)
            id += '-empty';
        return (React.createElement(react_portal_1.Portal, null,
            React.createElement(exports.Wrapper, Object.assign({ id: id, active: isActive, ref: this.menuRef, style: { maxHeight: this.state.menu1MaxHeight } }, this.state.menu1Position),
                this.state.insertItem ? (React.createElement(LinkInputWrapper, null,
                    React.createElement(LinkInput, { type: "text", placeholder: this.state.insertItem.title
                            ? dictionary.pasteLinkWithTitle(this.state.insertItem.title)
                            : dictionary.pasteLink, onKeyDown: this.handleLinkInputKeydown, onPaste: this.handleLinkInputPaste, autoFocus: true }))) : (React.createElement(List, { ref: this.listRef, style: { rowGap: this.props.search ? 8 : 0 } },
                    this.props.search
                        ? this.renderSearchResults()
                        : this.renderGroups(),
                    this.props.search && this.filtered.length === 0 && (React.createElement(ListItem, null,
                        React.createElement(Empty, null, dictionary.noResults))))),
                uploadImage && (React.createElement(VisuallyHidden_1.default, null,
                    React.createElement("input", { type: "file", ref: this.inputRef, onChange: this.handleImagePicked, accept: "image/*" })))),
            React.createElement(exports.Wrapper, Object.assign({ ref: this.nestedMenuRef, active: this.state.nestedMenuOpen && !this.props.search }, this.state.menu2Position),
                React.createElement(List, null,
                    React.createElement(MenuTitle, { ref: this.menuTitleRef }, selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.groupData.name), (_a = selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.items) === null || _a === void 0 ? void 0 :
                    _a.map((item, index) => {
                        return this.props.renderMenuItem(item, index, () => { }, {
                            selected: this.state.nestedSelectedIndex === index,
                            onClick: () => this.insertItem(item),
                        });
                    }),
                    this.filtered.length === 0 && (React.createElement(ListItem, null,
                        React.createElement(Empty, null, dictionary.noResults)))))));
    }
}
const MenuTitle = styled_components_1.default.div `
  color: ${(props) => props.theme.placeholder};
  padding: 12px 0 20px 18px;
  font-family: Arial;
  font-size: 15px;
  font-weight: 600;
`;
const LinkInputWrapper = styled_components_1.default.div `
  margin: 8px;
`;
const LinkInput = styled_components_1.default(Input_1.default) `
  height: 36px;
  width: 100%;
  color: ${(props) => props.theme.blockToolbarText};
`;
const List = styled_components_1.default.ol `
  display: flex;
  flex-direction: column;
  list-style: none;
  text-align: left;
  height: 100%;
  padding: 12px 0;
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
  border-radius: 14px;
  box-shadow: rgb(0 0 0 / 8%) 0px 0.4rem 1.6rem 0px;
  opacity: 0;
  transform: scale(
    ${({ isAbove }) => (typeof isAbove === "boolean" ? 0.95 : 1)}
  );
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;
  min-width: 210px;
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

  ${({ active }) => active &&
    `
    pointer-events: all;
    opacity: 1;
    `};

  ${({ isAbove }) => typeof isAbove === "boolean" &&
    `
    transform: translateY(${isAbove ? "6px" : "-6px"}) scale(1);
  `}

  @media print {
    display: none;
  }
`;
exports.default = KnowtCommandMenu;
//# sourceMappingURL=KnowtCommandMenu.js.map