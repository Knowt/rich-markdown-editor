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
const outline_icons_1 = require("outline-icons");
const MenuItem_1 = __importDefault(require("./MenuItem"));
function BlockGroupMenuItem(props) {
    const { title, selected, disabled = false, onClick, containerId = "block-menu-container", innerRef, theme } = props;
    const ref = React.useCallback((node) => {
        innerRef === null || innerRef === void 0 ? void 0 : innerRef(node);
        if (selected && node) {
            smooth_scroll_into_view_if_needed_1.default(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: (parent) => parent.id !== containerId,
            });
        }
    }, [selected, containerId, innerRef]);
    return (React.createElement(MenuItem_1.default, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        title,
        React.createElement(Circle, null,
            React.createElement(outline_icons_1.ArrowIcon, { color: theme.blockToolbarExpandArrowColor, size: 17 }))));
}
const CIRCLE_RADIUS = 20;
const Circle = styled_components_1.default.div `
  display: flex;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_RADIUS}px;
  height: ${CIRCLE_RADIUS}px;
  min-width: ${CIRCLE_RADIUS}px;
  max-width: ${CIRCLE_RADIUS}px;
  min-height: ${CIRCLE_RADIUS}px;
  max-height: ${CIRCLE_RADIUS}px;
  border: 1px solid ${(props) => props.theme.blockToolbarDivider};
`;
exports.default = styled_components_1.withTheme(BlockGroupMenuItem);
//# sourceMappingURL=BlockGroupMenuItem.js.map