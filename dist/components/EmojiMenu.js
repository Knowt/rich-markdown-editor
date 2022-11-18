"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const gemoji_1 = __importDefault(require("gemoji"));
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
const CommandMenu_1 = __importDefault(require("./CommandMenu"));
const EmojiMenuItem_1 = __importDefault(require("./EmojiMenuItem"));
const searcher = new fuzzy_search_1.default(gemoji_1.default, ["names"], {
    caseSensitive: true,
    sort: true,
});
class EmojiMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = () => {
            var _a;
            const { state, dispatch } = this.props.view;
            const MENU_TRIGGER_LENGTH = 2;
            dispatch(state.tr.insertText("", state.selection.$from.pos -
                ((_a = this.props.search) !== null && _a !== void 0 ? _a : "").length -
                MENU_TRIGGER_LENGTH, state.selection.to));
        };
    }
    get items() {
        const { search = "" } = this.props;
        const n = search.toLowerCase();
        const result = searcher.search(n).map((item) => {
            const description = item.description;
            const name = item.names[0];
            return Object.assign(Object.assign({}, item), { name: "emoji", title: name, description, attrs: { markup: name, "data-name": name } });
        });
        return result.slice(0, 10);
    }
    render() {
        return (react_1.default.createElement(CommandMenu_1.default, Object.assign({}, this.props, { filterable: false, onClearSearch: this.clearSearch, renderMenuItem: (item, _index, options) => {
                return (react_1.default.createElement(EmojiMenuItem_1.default, { onClick: options.onClick, selected: options.selected, title: item.description, emoji: item.emoji }));
            }, items: this.items })));
    }
}
exports.default = EmojiMenu;
//# sourceMappingURL=EmojiMenu.js.map