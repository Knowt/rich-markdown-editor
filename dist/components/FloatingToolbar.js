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
const react_portal_1 = require("react-portal");
const useComponentSize_1 = __importDefault(require("../hooks/useComponentSize"));
const useMediaQuery_1 = __importDefault(require("../hooks/useMediaQuery"));
const useViewportHeight_1 = __importDefault(require("../hooks/useViewportHeight"));
const styled_components_1 = __importDefault(require("styled-components"));
const SSR = typeof window === "undefined";
const defaultPosition = {
    left: -1000,
    top: 0,
    offset: 0,
    visible: false,
};
function usePosition({ menuRef, isSelectingText, props }) {
    const { view, active } = props;
    const { selection } = view.state;
    const { width: menuWidth, height: menuHeight } = useComponentSize_1.default(menuRef);
    const viewportHeight = useViewportHeight_1.default();
    const isTouchDevice = useMediaQuery_1.default("(hover: none) and (pointer: coarse)");
    if (!active || !menuWidth || !menuHeight || SSR || isSelectingText) {
        return defaultPosition;
    }
    if (isTouchDevice && viewportHeight) {
        return {
            left: 0,
            right: 0,
            top: viewportHeight - menuHeight,
            offset: 0,
            visible: true,
        };
    }
    let fromPos;
    let toPos;
    try {
        fromPos = view.coordsAtPos(selection.from);
        toPos = view.coordsAtPos(selection.to, -1);
    }
    catch (err) {
        console.warn(err);
        return defaultPosition;
    }
    const selectionBounds = {
        top: Math.min(fromPos.top, toPos.top),
        bottom: Math.max(fromPos.bottom, toPos.bottom),
        left: Math.min(fromPos.left, toPos.left),
        right: Math.max(fromPos.right, toPos.right),
    };
    const isColSelection = selection.isColSelection && selection.isColSelection();
    const isRowSelection = selection.isRowSelection && selection.isRowSelection();
    if (isColSelection) {
        const { node: element } = view.domAtPos(selection.from);
        const { width } = element.getBoundingClientRect();
        selectionBounds.top -= 20;
        selectionBounds.right = selectionBounds.left + width;
    }
    if (isRowSelection) {
        selectionBounds.right = selectionBounds.left = selectionBounds.left - 18;
    }
    const isImageSelection = selection.node && selection.node.type.name === "image";
    if (isImageSelection) {
        const element = view.nodeDOM(selection.from);
        const imageElement = element.getElementsByTagName("img")[0];
        const { left, top, width } = imageElement.getBoundingClientRect();
        return {
            left: Math.round(left + width / 2 + window.scrollX - menuWidth / 2),
            top: Math.round(top + window.scrollY - menuHeight),
            offset: 0,
            visible: true,
        };
    }
    else {
        const halfSelection = Math.abs(selectionBounds.right - selectionBounds.left) / 2;
        const centerOfSelection = selectionBounds.left + halfSelection;
        const margin = 12;
        const left = Math.min(window.innerWidth - menuWidth - margin, Math.max(margin, centerOfSelection - menuWidth / 2));
        const top = Math.min(window.innerHeight - menuHeight - margin, Math.max(margin, selectionBounds.top - menuHeight));
        const offset = left - (centerOfSelection - menuWidth / 2);
        return {
            left: Math.round(left + window.scrollX),
            top: Math.round(top + window.scrollY),
            offset: Math.round(offset),
            visible: true,
        };
    }
}
function FloatingToolbar(props) {
    const menuRef = props.forwardedRef || React.createRef();
    const [isSelectingText, setSelectingText] = React.useState(false);
    const position = usePosition({
        menuRef,
        isSelectingText,
        props,
    });
    React.useEffect(() => {
        const handleMouseDown = () => {
            if (!props.active) {
                setSelectingText(true);
            }
        };
        const handleMouseUp = () => {
            setSelectingText(false);
        };
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [props.active]);
    return (React.createElement(react_portal_1.Portal, { node: document.getElementById('knowt-editor-wrapper') },
        React.createElement(Wrapper, { active: props.active && position.visible, ref: menuRef, offset: position.offset, style: {
                top: `${position.top}px`,
                left: `${position.left}px`,
            } }, position.visible && props.children)));
}
const Wrapper = styled_components_1.default.div `
  display: flex;
  overflow: hidden;
  will-change: opacity, transform;
  position: absolute;
  z-index: ${props => props.theme.zIndex + 100};
  opacity: 0;
  background: ${props => props.theme.toolbarBackground};
  border-radius: 4px;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
              transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  height: 35px;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;
  // DO NOT REMOVE THIS
  // idk why but you need this to calc position of toolbar
  min-width: 1px;
  box-shadow: 0px 0px 0.3px ${props => props.theme.toolbarShadow},
              0px 0px 0.9px ${props => props.theme.toolbarShadow},
              0px 0px 1.8px ${props => props.theme.toolbarShadow},
              0px 0px 3.7px ${props => props.theme.toolbarShadow},
              0px 0px 10px ${props => props.theme.toolbarShadow};

  * {
    box-sizing: border-box;
  }

  ${({ active }) => active &&
    `
    transform: translateY(-6px) scale(1);
    opacity: 1;
  `};

  @media print {
    display: none;
  }

  @media (hover: none) and (pointer: coarse) {
    transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(1);
    border-radius: 0;
    width: 100vw;
    position: fixed;
  }
`;
exports.default = React.forwardRef(function FloatingToolbarWithForwardedRef(props, ref) {
    return React.createElement(FloatingToolbar, Object.assign({}, props, { forwardedRef: ref }));
});
//# sourceMappingURL=FloatingToolbar.js.map