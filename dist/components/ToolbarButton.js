"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
;
exports.default = styled_components_1.default.button `
  display: flex;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;
  padding: 10px 3px;
  border: none;
  background: none;
  transition: opacity 85ms ease-in-out,
              background-color 85ms ease-in-out;
  opacity: 0.7;
  outline: none;
  pointer-events: all;
  position: relative;
  height: 100%;

  &:first-child {
    margin-left: 0;
  }

  .icon {
    &.light {
      filter: saturate( 300% ) brightness( 93% );

      // &.yellow {
      //   filter: saturate( 1500% ) brightness( 90% );
      // }
    }
  }

  &:hover {
    opacity: 1;
    background: ${(props) => props.theme.toolbarHoverBackground};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  &:before {
    position: absolute;
    content: "";
    top: -4px;
    right: -4px;
    left: -4px;
    bottom: -4px;
  }

  ${props => props.active && `
    opacity: 1; 
    background: ${props.showBackgroundOnActive ? props.theme.toolbarHoverBackground : 'none'};
  `};
`;
//# sourceMappingURL=ToolbarButton.js.map