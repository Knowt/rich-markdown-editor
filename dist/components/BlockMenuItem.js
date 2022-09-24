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
const React = __importStar(require("react"));
const smooth_scroll_into_view_if_needed_1 = __importDefault(require("smooth-scroll-into-view-if-needed"));
const styled_components_1 = __importStar(require("styled-components"));
function BlockMenuItem({ selected, disabled, onClick, title, icon, iconSVGProps, innerRef, mainSearchKeyword, containerId = "block-menu-container", theme }) {
    const Icon = icon;
    const ref = React.useCallback((node) => {
        innerRef === null || innerRef === void 0 ? void 0 : innerRef(node);
        if (selected && node) {
            smooth_scroll_into_view_if_needed_1.default(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: (parent) => parent.id !== containerId,
            });
        }
    }, [selected, containerId]);
    return (React.createElement(MenuItem, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        React.createElement(Group, null,
            Icon && (React.createElement(React.Fragment, null,
                React.createElement(Icon, Object.assign({ color: theme.blockToolbarIconColor, size: 20 }, iconSVGProps)),
                "\u00A0\u00A0")),
            React.createElement(Title, null, title)),
        React.createElement(Group, null, mainSearchKeyword && (React.createElement(SearchKeyword, null, mainSearchKeyword)))));
}
const MenuItem = styled_components_1.default.button `
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 17px;
  line-height: 1;
  width: 100%;
  height: 40px;
  cursor: pointer;
  border: none;
  opacity: ${(props) => (props.disabled ? ".5" : "1")};
  color: ${(props) => props.selected
    ? props.theme.blockToolbarTextSelected
    : props.theme.blockToolbarText};
  background: ${(props) => props.selected
    ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
    : "none"};
  padding: 0 16px;
  outline: none;

  &:hover,
  &:active {
    color: ${(props) => props.theme.blockToolbarTextSelected};
    background: ${(props) => props.selected
    ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
    : props.theme.blockToolbarHoverBackground};
  }
`;
const Group = styled_components_1.default.div `
  display: flex;
  align-items: center;
`;
const Title = styled_components_1.default.span `
  margin-right: 60px;
`;
const SearchKeyword = styled_components_1.default.span `
  font-size: 12px;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: ${(props) => props.theme.knowtGreen};
  background-color: ${(props) => props.theme.blockToolbarTagBackgroundColor};
`;
exports.default = styled_components_1.withTheme(BlockMenuItem);
//# sourceMappingURL=BlockMenuItem.js.map