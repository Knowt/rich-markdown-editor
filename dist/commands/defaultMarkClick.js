"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMarkClick = void 0;
const defaultMarkClick = (input) => {
    const { item, commands } = input;
    if (item.customOnClick) {
        return item.customOnClick();
    }
    if (!item.name)
        return;
    commands[item.name](item.attrs);
};
exports.defaultMarkClick = defaultMarkClick;
//# sourceMappingURL=defaultMarkClick.js.map