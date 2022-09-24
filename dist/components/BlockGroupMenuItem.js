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
    const arrowIcon = (React.createElement("svg", { fill: theme.blockToolbarExpandArrowColor, width: "8", x: "0px", y: "0px", viewBox: "0 0 1000 1000" },
        React.createElement("g", { transform: "translate(0.000000,511.000000) scale(0.100000,-0.100000)" },
            React.createElement("path", { d: "M2608.4,4961.2c-156.9-68.9-317.7-264.1-348.3-424.9c-61.2-344.5-134-260.3,2024.8-2419.1L6283,115.3L4284.9-1882.7C2122.3-4053,2195-3961.2,2263.9-4313.3c34.4-187.5,264.1-417.2,451.7-451.6c356-68.9,233.5-168.4,2713.9,2308.1C7446.7-435.8,7718.4-156.4,7737.5-26.3c65.1,356,164.6,237.3-2269.8,2683.2C4177.8,3950.7,3167.3,4930.6,3098.4,4961.2C2945.3,5026.3,2757.7,5026.3,2608.4,4961.2z" }))));
    return (React.createElement(MenuItem, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        title,
        React.createElement(Circle, null, arrowIcon)));
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