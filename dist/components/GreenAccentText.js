"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const GreenAccentText = styled_components_1.default.span.attrs(({ fontSize = 12 }) => ({
    style: {
        fontSize: `${fontSize}px`,
    },
})) `
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
exports.default = GreenAccentText;
//# sourceMappingURL=GreenAccentText.js.map