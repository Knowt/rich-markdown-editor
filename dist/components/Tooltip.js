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
const styled_components_1 = __importDefault(require("styled-components"));
const react_1 = __importStar(require("react"));
const useDelay_1 = __importDefault(require("../hooks/useDelay"));
const TOOLTIP_PADDING = 14;
const getTooltipStyles = (input) => {
    var _a, _b;
    const { ref, tooltipRef, position } = input;
    const refRect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    const tooltipRect = (_b = tooltipRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
    if (tooltipRect && refRect) {
        if (position === 'top') {
            return {
                left: '50%',
                bottom: `${refRect.height - tooltipRect.height + TOOLTIP_PADDING}px`
            };
        }
        else if (position === 'bottom') {
            return {
                left: `50%`,
                top: `${refRect.height + tooltipRect.height - TOOLTIP_PADDING}px`
            };
        }
    }
    return {};
};
const TooltipWrapper = styled_components_1.default.div `
  display: flex;
  position: absolute;
  padding-inline: 4px;
  font-size: 83%;
  background: ${props => props.theme.toolbarBackground};
  font-family: ${props => props.theme.fontFamily};
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  border-radius: 7px;
  z-index: 100;
  box-shadow: 0px 0px 0.3px ${props => props.theme.toolbarShadow},
              0px 0px 0.9px ${props => props.theme.toolbarShadow},
              0px 0px 1.8px ${props => props.theme.toolbarShadow},
              0px 0px 3.7px ${props => props.theme.toolbarShadow},
              0px 0px 10px ${props => props.theme.toolbarShadow};

  transform: translate( -50%, -50% );
  transition: opacity 0.18s ease,
              visibility 0.18s ease,
              transform 0.18s ease;

  &.not-active {
    opacity: 0;
    visibility: hidden;

    transform: scaleY( 0.8 )
                translate( -50%, -50% );
  }

  .tooltip {
    display: flex;
    position: relative;

    .pointer {
      position: absolute;
      transform: translate( -50%, -50% );

      &.top {
        left: 50%;
        top: 100%;

        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${props => props.theme.toolbarBackground};
      }

      &.bottom {
        left: 50%;
        top: 0;

        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        
        border-bottom: 8px solid ${props => props.theme.toolbarBackground};
      }
    }
  }

  /* POSITION */
  &.top {
    transform-origin: bottom;
  }

  &.bottom {
    transform-origin: top;
  }
`;
const Tooltip = react_1.forwardRef(({ children, id, position = 'top', includeArrow = true, delayShowTime = 0, }, ref) => {
    const tooltipRef = react_1.useRef(null);
    const [isActive, setIsActive] = react_1.useState(false);
    const [tooltipStyles, setTooltipStyles] = react_1.useState({});
    const shouldDisplay = useDelay_1.default({
        isActive,
        delayTime: delayShowTime,
    });
    const handlePointerOver = react_1.useCallback(() => {
        setIsActive(true);
    }, [isActive]);
    const handlePointeLeave = react_1.useCallback(() => {
        setIsActive(false);
    }, [isActive]);
    react_1.useEffect(() => {
        var _a, _b;
        if (typeof ref !== 'function' && (ref === null || ref === void 0 ? void 0 : ref.current)) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.addEventListener('pointerover', handlePointerOver);
            (_b = ref.current) === null || _b === void 0 ? void 0 : _b.addEventListener('pointerleave', handlePointeLeave);
            setTooltipStyles(getTooltipStyles({
                ref,
                tooltipRef,
                position,
            }));
            return () => {
                var _a, _b;
                (_a = ref.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('pointerover', handlePointerOver);
                (_b = ref.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('pointerleave', handlePointeLeave);
            };
        }
    }, [ref]);
    return (react_1.default.createElement(TooltipWrapper, { id: id, ref: tooltipRef, className: isActive && shouldDisplay ? `active ${position} tooltip-wrapper` :
            `not-active ${position} tooltip-wrapper`, role: 'tooltip', style: tooltipStyles },
        react_1.default.createElement("span", { className: 'tooltip' },
            children,
            includeArrow ? (react_1.default.createElement("span", { className: `pointer ${position}`, "aria-hidden": true })) : '')));
});
exports.default = Tooltip;
//# sourceMappingURL=Tooltip.js.map