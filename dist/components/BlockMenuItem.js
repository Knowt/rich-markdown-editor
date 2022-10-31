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
const MenuItem_1 = __importDefault(require("./MenuItem"));
const GreenAccentText_1 = __importDefault(require("./GreenAccentText"));
const getIconClasses_1 = require("../lib/getIconClasses");
const constants_1 = require("../lib/constants");
function BlockMenuItem({ selected, disabled, onClick, title, icon, iconSVGProps, innerRef, accentText, containerId = "block-menu-container", theme, iconColor, isDarkMode, itemName, }) {
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
    return (React.createElement(MenuItem_1.default, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        React.createElement(Group, null,
            Icon && (React.createElement(React.Fragment, null,
                React.createElement(Icon, Object.assign({ className: getIconClasses_1.getIconClasses(!!(!isDarkMode && iconColor)), color: itemName === 'highlight_yellow' ? constants_1.CUSTOM_ICON_YELLOW :
                        iconColor || theme.blockToolbarIconColor, size: 20 }, iconSVGProps)),
                "\u00A0\u00A0")),
            React.createElement(Title, null, title)),
        React.createElement(Group, null, accentText && (React.createElement(GreenAccentText_1.default, null, accentText)))));
}
const Group = styled_components_1.default.div `
  display: flex;
  align-items: center;

  .icon {
    &.light {
      filter: saturate( 300% ) brightness( 93% );
    }
  }
`;
const Title = styled_components_1.default.span `
  margin-right: 60px;
`;
exports.default = styled_components_1.withTheme(BlockMenuItem);
//# sourceMappingURL=BlockMenuItem.js.map