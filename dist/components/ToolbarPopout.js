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
const styled_components_1 = __importDefault(require("styled-components"));
const defaultMarkClick_1 = require("../commands/defaultMarkClick");
const react_portal_1 = require("react-portal");
const getIconClasses_1 = require("../lib/getIconClasses");
const constants_1 = require("../lib/constants");
const List = styled_components_1.default.ul `
    display: flex;
    flex-direction: column;
    position: absolute;
    font-size: 90%;
    list-style-type: none;
    background: ${props => props.theme.toolbarBackground};
    z-index: 1000;
    border-radius: 4px;
    padding: 0;
    box-shadow: 0px 0px 0.3px ${props => props.theme.toolbarShadow},
                0px 0px 0.9px ${props => props.theme.toolbarShadow},
                0px 0px 1.8px ${props => props.theme.toolbarShadow},
                0px 0px 3.7px ${props => props.theme.toolbarShadow},
                0px 0px 10px ${props => props.theme.toolbarShadow};

    transform: scale( 1 );
    transition: opacity 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                visibility 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &.not-active {
        opacity: 0;
        visibility: hidden;
        transform: translate( 4px ) 
                    scale(0.95);
    }

    /* POSITION */
    &.left {
        transform-origin: right;
    }

    &.right {
        transform-origin: left;
    }
`;
const Title = styled_components_1.default.span `
    margin-left: 5px;
`;
const Button = styled_components_1.default.button `
    display: flex;
    align-items: center;
    border: none;
    background: none;
    cursor: pointer;
    padding-block: 7px;
    color: ${(props) => props.theme.text};

    &:first-of-type {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }

    &:last-of-type {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    transition: background-color 85ms ease-in-out;

    &:hover,
    &:focus {
        outline: none;
        background: ${(props) => props.theme.toolbarHoverBackground};
    }

    .icon {
        &.light {
            filter: saturate( 300% ) brightness( 93% );
        }
    }
`;
const calcPopoutStyles = (input) => {
    var _a, _b;
    const { ref, popoutRef, position } = input;
    const refRect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    const popoutRefRect = (_b = popoutRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
    if (refRect && popoutRefRect) {
        const SCROLL_HEIGHT = window.innerHeight + window.scrollY;
        let top = refRect.top -
            (refRect.height / 2) +
            window.scrollY +
            POPOUT_PADDING;
        const getDefaultVerticalStyles = () => {
            if (top + popoutRefRect.height > SCROLL_HEIGHT) {
                top -= popoutRefRect.height;
            }
            return {
                top: `${top}px`
            };
        };
        const getShiftedVertialStyles = () => {
            top += TOOLBAR_HEIGHT;
            if (top + popoutRefRect.height > SCROLL_HEIGHT) {
                top -= TOOLBAR_HEIGHT + popoutRefRect.height;
            }
            return {
                top: `${top}px`,
            };
        };
        if (position === 'left') {
            const left = refRect.x -
                (refRect.width / 2) -
                popoutRefRect.width +
                POPOUT_PADDING;
            if (left < 0) {
                return Object.assign({ left: '0px' }, getShiftedVertialStyles());
            }
            return Object.assign({ left: `${left}px` }, getDefaultVerticalStyles());
        }
        else {
            const left = refRect.x -
                refRect.width +
                (popoutRefRect.width / 2) -
                POPOUT_PADDING - 2;
            if (left + popoutRefRect.width > window.innerWidth + window.scrollX) {
                return Object.assign({ right: '0px' }, getShiftedVertialStyles());
            }
            return Object.assign({ left: `${left}px` }, getDefaultVerticalStyles());
        }
    }
    return {};
};
const POPOUT_PADDING = 3;
const TOOLBAR_HEIGHT = 35;
const ToolbarPopout = react_1.forwardRef(({ id, position, items, close, isActive, commands, theme, shouldLightIcon, }, ref) => {
    const popoutRef = react_1.useRef(null);
    const firstMenuItemRef = react_1.useRef(null);
    const [popoutStyles, setPopoutStyles] = react_1.useState({});
    react_1.useEffect(() => {
        if (typeof ref !== 'function' && (ref === null || ref === void 0 ? void 0 : ref.current) &&
            isActive) {
            setPopoutStyles(calcPopoutStyles({
                ref,
                popoutRef,
                position,
            }));
        }
    }, [isActive, ref]);
    if (isActive) {
        setTimeout(() => {
            if (firstMenuItemRef.current) {
                firstMenuItemRef.current.focus();
            }
        }, 28);
    }
    let className = position;
    if (isActive) {
        className += ' active';
    }
    else {
        className += ' not-active';
    }
    return (react_1.default.createElement(react_portal_1.Portal, null,
        react_1.default.createElement(List, { id: id, ref: popoutRef, className: className, style: popoutStyles }, items.map((item, index) => {
            const { name, tooltip, icon, iconColor, iconSVGProps, } = item;
            const Icon = icon;
            const handleClick = () => {
                defaultMarkClick_1.defaultMarkClick({
                    item,
                    commands,
                });
                close();
            };
            const handleMouseUp = (event) => {
                event.preventDefault();
                event.stopPropagation();
            };
            return (react_1.default.createElement(Button, { ref: index === 0 ? firstMenuItemRef : undefined, onMouseUp: handleMouseUp, onClick: handleClick, key: `${name}${index}`, type: 'button', "aria-pressed": false },
                Icon ? (react_1.default.createElement(Icon, Object.assign({ className: getIconClasses_1.getIconClasses(shouldLightIcon), color: item.name === 'highlight_yellow ' ?
                        constants_1.CUSTOM_ICON_YELLOW : iconColor || theme.toolbarItem, size: 22 }, iconSVGProps))) : '',
                react_1.default.createElement(Title, null, tooltip)));
        }))));
});
exports.default = ToolbarPopout;
//# sourceMappingURL=ToolbarPopout.js.map