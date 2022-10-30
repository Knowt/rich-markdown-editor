"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
function tableRowMenuItems(state, index, dictionary) {
    return [
        {
            name: "addRowBefore",
            tooltip: dictionary.addRowBefore,
            icon: outline_icons_1.InsertAboveIcon,
            attrs: { index: index - 1 },
            active: () => false,
        },
        {
            name: "addRowAfter",
            tooltip: dictionary.addRowAfter,
            icon: outline_icons_1.InsertBelowIcon,
            attrs: { index },
            active: () => false,
        },
        {
            name: "separator",
        },
        {
            name: "deleteRow",
            tooltip: dictionary.deleteRow,
            icon: outline_icons_1.TrashIcon,
            active: () => false,
        },
    ];
}
exports.default = tableRowMenuItems;
//# sourceMappingURL=tableRow.js.map