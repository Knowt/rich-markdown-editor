"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
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
exports.default = MenuItem;
//# sourceMappingURL=MenuItem.js.map