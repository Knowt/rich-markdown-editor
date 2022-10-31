"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
const KnowtCommandMenu_1 = __importDefault(require("./KnowtCommandMenu"));
const BlockMenuItem_1 = __importDefault(require("./BlockMenuItem"));
const BlockGroupMenuItem_1 = __importDefault(require("./BlockGroupMenuItem"));
const block_1 = require("../menus/block");
class BlockMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = (clearLength = 0) => {
            const { state, dispatch } = this.props.view;
            const parent = prosemirror_utils_1.findParentNode((node) => !!node)(state.selection);
            if (parent) {
                const deleteFrom = Math.max(parent.pos, state.selection.to - clearLength);
                dispatch(state.tr.insertText("", deleteFrom, state.selection.to));
            }
        };
    }
    get groupedItems() {
        return block_1.getGroupedMenuItems(this.props.view, this.props.dictionary, this.props.deviceType);
    }
    get embedsGroup() {
        return block_1.getEmbedsGroup(this.props.embeds);
    }
    get allGroups() {
        return [...this.groupedItems, this.embedsGroup];
    }
    get visibleGroups() {
        return this.allGroups
            .map((group) => (Object.assign(Object.assign({}, group), { items: group.items.filter(({ defaultHidden }) => !defaultHidden) })))
            .filter(({ items }) => items.length > 0);
    }
    render() {
        return (react_1.default.createElement(KnowtCommandMenu_1.default, Object.assign({}, this.props, { filterable: true, onClearSearch: this.clearSearch, allGroups: this.allGroups, visibleGroups: this.visibleGroups, renderMenuItem: (item, _index, innerRef, options) => {
                return (react_1.default.createElement(BlockMenuItem_1.default, { key: item.title, innerRef: innerRef, onClick: options.onClick, selected: options.selected, icon: item.icon, iconSVGProps: item.iconSVGProps, title: item.title, accentText: item.searchKeyword, iconColor: item.iconColor, isDarkMode: this.props.isDarkMode, itemName: item.name }));
            }, renderGroupMenuItem: (item, _index, innerRef, options) => {
                return (react_1.default.createElement(BlockGroupMenuItem_1.default, { innerRef: innerRef, key: item.groupData.name, title: item.groupData.name, selected: options.selected, onClick: options.onClick }));
            } })));
    }
}
exports.default = BlockMenu;
//# sourceMappingURL=BlockMenu.js.map