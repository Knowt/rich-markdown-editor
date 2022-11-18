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
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const ToolbarButton_1 = __importDefault(require("./ToolbarButton"));
const ToolbarSeparator_1 = __importDefault(require("./ToolbarSeparator"));
const defaultMarkClick_1 = require("../commands/defaultMarkClick");
const Tooltip_1 = __importDefault(require("./Tooltip"));
const icons_1 = require("../icons");
const ToolbarPopout_1 = __importDefault(require("./ToolbarPopout"));
const getIconClasses_1 = require("../lib/getIconClasses");
const constants_1 = require("../lib/constants");
const getRandomId_1 = require("../lib/getRandomId");
const FlexibleWrapper = styled_components_1.default.div `
  display: flex;
`;
const MainIconWrapper = styled_components_1.default.div `
  display: flex;

  .tooltip-wrapper {
    text-align: center;

    .tooltip {
      flex-direction: column;
      line-height: 0;

      .shortcut {
        font-size: 85%;
        margin-top: 2px;
        color: ${props => props.theme.toolbarShortcutText};
      }
    }
  }

  @media screen and ( max-width: 800px ) {
    .tooltip-wrapper {
      display: none;
    }
  }
`;
const TOOLTIP_DELAY = 500;
const ToolbarSubItems = ({ id, subItems, theme, commands, shouldLightIcon, }) => {
    const { orientation, tooltip, items } = subItems;
    const [isActive, setIsActive] = react_1.useState(false);
    const ref = react_1.useRef(null);
    const toggleActive = () => {
        setIsActive(state => !state);
    };
    const closePopout = () => {
        setIsActive(false);
    };
    const ariaControls = `${id}-popout${getRandomId_1.getRandomId()}`;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ToolbarButton_1.default, { ref: ref, className: 'chevron-toolbar-button', type: 'button', showBackgroundOnActive: true, onClick: toggleActive, "aria-label": tooltip, "aria-pressed": isActive, "aria-controls": ariaControls, active: isActive, "aria-describedby": id },
            react_1.default.createElement("span", { style: orientation === 'left' ? {
                    transform: 'rotate(180deg)',
                } : {} },
                react_1.default.createElement(icons_1.ChevronIcon, { fill: theme.blockToolbarExpandArrowColor })),
            tooltip ? (react_1.default.createElement(Tooltip_1.default, { id: id, ref: ref, delayShowTime: TOOLTIP_DELAY, position: 'top' },
                react_1.default.createElement("p", { className: 'item-name' }, tooltip))) : ''),
        react_1.default.createElement(ToolbarPopout_1.default, { id: ariaControls, ref: ref, position: orientation, items: items, isActive: isActive, close: closePopout, commands: commands, theme: theme, shouldLightIcon: shouldLightIcon })));
};
const ToolbarItem = ({ item, theme, commands, state, isDarkMode, index, }) => {
    var _a, _b, _c;
    const ref = react_1.useRef(null);
    const Icon = item.icon;
    const isActive = item.active ? item.active(state) : false;
    const id = `${item.name}${index}${getRandomId_1.getRandomId()}`;
    const shouldLightIcon = !!(!isDarkMode &&
        (item.iconColor || ((_a = item === null || item === void 0 ? void 0 : item.iconSVGProps) === null || _a === void 0 ? void 0 : _a.fill)));
    return (react_1.default.createElement(MainIconWrapper, null,
        ((_b = item.subItems) === null || _b === void 0 ? void 0 : _b.orientation) === 'left' ? (react_1.default.createElement(ToolbarSubItems, { id: `${item.name}-left${index}${getRandomId_1.getRandomId()}`, subItems: item.subItems, theme: theme, commands: commands, shouldLightIcon: shouldLightIcon })) : '',
        react_1.default.createElement(ToolbarButton_1.default, { className: 'toolbar-selection-item-button', ref: ref, active: isActive, type: 'button', "aria-pressed": isActive, "aria-describedby": id, onClick: () => defaultMarkClick_1.defaultMarkClick({
                item,
                commands,
            }) },
            react_1.default.createElement(Icon, Object.assign({ className: getIconClasses_1.getIconClasses(shouldLightIcon), color: item.name === 'highlight_yellow ' ?
                    constants_1.CUSTOM_ICON_YELLOW : item.iconColor || theme.toolbarItem }, item.iconSVGProps)),
            react_1.default.createElement(Tooltip_1.default, { id: id, ref: ref, delayShowTime: TOOLTIP_DELAY, position: 'top' },
                react_1.default.createElement("p", { className: 'item-name' }, item.tooltip),
                item.shortcut ? (react_1.default.createElement("p", { className: 'shortcut' }, item.shortcut)) : '')),
        ((_c = item.subItems) === null || _c === void 0 ? void 0 : _c.orientation) === 'right' ? (react_1.default.createElement(ToolbarSubItems, { id: `${item.name}-right${index}${getRandomId_1.getRandomId()}`, subItems: item.subItems, theme: theme, commands: commands, shouldLightIcon: shouldLightIcon })) : ''));
};
class ToolbarMenu extends react_1.default.Component {
    render() {
        const { view, items } = this.props;
        const { state } = view;
        return (react_1.default.createElement(FlexibleWrapper, null, items.map((item, index) => {
            if (item.name === "separator" && item.visible !== false) {
                return react_1.default.createElement(ToolbarSeparator_1.default, { key: index });
            }
            if (item.visible === false || !item.icon) {
                return '';
            }
            return (react_1.default.createElement(ToolbarItem, { key: index, item: item, theme: this.props.theme, commands: this.props.commands, view: view, state: state, isDarkMode: this.props.isDarkMode, index: index }));
        })));
    }
}
exports.default = styled_components_1.withTheme(ToolbarMenu);
//# sourceMappingURL=ToolbarMenu.js.map