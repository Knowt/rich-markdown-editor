"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isSelectionEmpty = (selection) => {
    const slice = selection.content();
    const fragment = slice.content;
    let isEmpty = true;
    fragment.descendants((node) => {
        if (node.textContent.trim() !== "") {
            isEmpty = false;
            return false;
        }
    });
    return isEmpty;
};
exports.default = isSelectionEmpty;
//# sourceMappingURL=isSelectionEmpty.js.map