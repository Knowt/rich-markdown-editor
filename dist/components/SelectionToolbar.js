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
const React = __importStar(require("react"));
const react_portal_1 = require("react-portal");
const some_1 = __importDefault(require("lodash/some"));
const prosemirror_state_1 = require("prosemirror-state");
const tableCol_1 = __importDefault(require("../menus/tableCol"));
const tableRow_1 = __importDefault(require("../menus/tableRow"));
const table_1 = __importDefault(require("../menus/table"));
const formatting_1 = __importDefault(require("../menus/formatting"));
const image_1 = __importDefault(require("../menus/image"));
const divider_1 = __importDefault(require("../menus/divider"));
const FloatingToolbar_1 = __importDefault(require("./FloatingToolbar"));
const LinkEditor_1 = __importDefault(require("./LinkEditor"));
const ToolbarMenu_1 = __importDefault(require("./ToolbarMenu"));
const filterExcessSeparators_1 = __importDefault(require("../lib/filterExcessSeparators"));
const isMarkActive_1 = __importDefault(require("../queries/isMarkActive"));
const getMarkRange_1 = __importDefault(require("../queries/getMarkRange"));
const isNodeActive_1 = __importDefault(require("../queries/isNodeActive"));
const getColumnIndex_1 = __importDefault(require("../queries/getColumnIndex"));
const getRowIndex_1 = __importDefault(require("../queries/getRowIndex"));
const createAndInsertLink_1 = __importDefault(require("../commands/createAndInsertLink"));
function isVisible(props) {
    const { view } = props;
    const { selection } = view.state;
    if (!selection)
        return false;
    if (selection.empty)
        return false;
    if (selection.node && selection.node.type.name === "hr") {
        return true;
    }
    if (selection.node && selection.node.type.name === "image") {
        return true;
    }
    if (selection.node)
        return false;
    const slice = selection.content();
    const fragment = slice.content;
    const nodes = fragment.content;
    return some_1.default(nodes, (n) => n.content.size);
}
class SelectionToolbar extends React.Component {
    constructor() {
        super(...arguments);
        this.isActive = false;
        this.menuRef = React.createRef();
        this.handleClickOutside = (ev) => {
            if (ev.target instanceof Node &&
                this.menuRef.current &&
                this.menuRef.current.contains(ev.target)) {
                return;
            }
            if (!this.isActive) {
                return;
            }
            const { view } = this.props;
            if (view.hasFocus()) {
                return;
            }
            const { dispatch } = view;
            dispatch(view.state.tr.setSelection(new prosemirror_state_1.TextSelection(view.state.doc.resolve(0))));
        };
        this.handleOnCreateLink = async (title) => {
            const { dictionary, onCreateLink, view, onShowToast } = this.props;
            if (!onCreateLink) {
                return;
            }
            const { dispatch, state } = view;
            const { from, to } = state.selection;
            if (from === to) {
                return;
            }
            const href = `creating#${title}…`;
            const markType = state.schema.marks.link;
            dispatch(view.state.tr
                .removeMark(from, to, markType)
                .addMark(from, to, markType.create({ href })));
            createAndInsertLink_1.default(view, title, href, {
                onCreateLink,
                onShowToast,
                dictionary,
            });
        };
        this.handleOnSelectLink = ({ href, from, to, }) => {
            const { view } = this.props;
            const { state, dispatch } = view;
            const markType = state.schema.marks.link;
            dispatch(state.tr
                .removeMark(from, to, markType)
                .addMark(from, to, markType.create({ href })));
        };
    }
    componentDidUpdate() {
        const visible = isVisible(this.props);
        if (this.isActive && !visible) {
            this.isActive = false;
            this.props.onClose();
        }
        if (!this.isActive && visible) {
            this.isActive = true;
            this.props.onOpen();
        }
    }
    componentDidMount() {
        window.addEventListener("mouseup", this.handleClickOutside);
    }
    componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleClickOutside);
    }
    render() {
        const _a = this.props, { dictionary, onCreateLink, isTemplate, rtl, deviceType, defaultBackground, defaultHighlight, setDefaultBackground, setDefaultHighlight } = _a, rest = __rest(_a, ["dictionary", "onCreateLink", "isTemplate", "rtl", "deviceType", "defaultBackground", "defaultHighlight", "setDefaultBackground", "setDefaultHighlight"]);
        const { view } = rest;
        const { state } = view;
        const { selection } = state;
        const isCodeSelection = isNodeActive_1.default(state.schema.nodes.code_block)(state);
        const isDividerSelection = isNodeActive_1.default(state.schema.nodes.hr)(state);
        if (isCodeSelection) {
            return null;
        }
        const colIndex = getColumnIndex_1.default(state.selection);
        const rowIndex = getRowIndex_1.default(state.selection);
        const isTableSelection = colIndex !== undefined && rowIndex !== undefined;
        const link = isMarkActive_1.default(state.schema.marks.link)(state);
        const range = getMarkRange_1.default(selection.$from, state.schema.marks.link);
        const isImageSelection = selection.node && selection.node.type.name === "image";
        let isTextSelection = false;
        let items = [];
        if (isTableSelection &&
            typeof rowIndex === 'number') {
            items = table_1.default(dictionary, {
                rowIndex,
                rtl,
            });
        }
        else if (colIndex !== undefined) {
            items = tableCol_1.default(state, colIndex, rtl, dictionary);
        }
        else if (rowIndex !== undefined) {
            items = tableRow_1.default(state, rowIndex, dictionary);
        }
        else if (isImageSelection) {
            items = image_1.default(state, dictionary);
        }
        else if (isDividerSelection) {
            items = divider_1.default(state, dictionary);
        }
        else {
            items = formatting_1.default({
                view,
                isTemplate,
                dictionary,
                deviceType,
                defaultHighlight,
                defaultBackground,
                setDefaultBackground,
                setDefaultHighlight,
                commands: this.props.commands,
            });
            isTextSelection = true;
        }
        items = items.filter((item) => {
            if (item.name === "separator")
                return true;
            if (item.name && !item.customOnClick && !this.props.commands[item.name])
                return false;
            return true;
        });
        items = filterExcessSeparators_1.default(items);
        if (!items.length) {
            return null;
        }
        const selectionText = state.doc.cut(state.selection.from, state.selection.to).textContent;
        if (isTextSelection && !selectionText) {
            return null;
        }
        return (React.createElement(react_portal_1.Portal, null,
            React.createElement(FloatingToolbar_1.default, { view: view, active: isVisible(this.props), ref: this.menuRef }, link && range ? (React.createElement(LinkEditor_1.default, Object.assign({ dictionary: dictionary, mark: range.mark, from: range.from, to: range.to, onCreateLink: onCreateLink ? this.handleOnCreateLink : undefined, onSelectLink: this.handleOnSelectLink }, rest))) : (React.createElement(ToolbarMenu_1.default, Object.assign({ items: items }, rest))))));
    }
}
exports.default = SelectionToolbar;
//# sourceMappingURL=SelectionToolbar.js.map