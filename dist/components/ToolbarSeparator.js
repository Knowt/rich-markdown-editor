"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const Separator = styled_components_1.default.div `
  height: 65%;
  margin-block: auto;
  margin-inline: 4px;
  width: 2px;
  background: ${props => props.theme.toolbarItem};
  opacity: 0.3;
  display: inline-block;
`;
exports.default = Separator;
//# sourceMappingURL=ToolbarSeparator.js.map