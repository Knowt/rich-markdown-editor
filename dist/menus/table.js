"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
function tableMenuItems(dictionary, tableIndexes) {
    const { rowIndex, rtl } = tableIndexes;
    return [
        {
            name: "deleteTable",
            tooltip: dictionary.deleteTable,
            icon: outline_icons_1.TrashIcon,
            active: () => false,
        },
        {
            name: "separator",
        },
        {
            name: "addRowBefore",
            tooltip: dictionary.addRowBefore,
            icon: outline_icons_1.InsertAboveIcon,
            attrs: { index: rowIndex - 1 },
            active: () => false,
        },
        {
            name: "addRowAfter",
            tooltip: dictionary.addRowAfter,
            icon: outline_icons_1.InsertBelowIcon,
            attrs: { index: rowIndex },
            active: () => false,
        },
        {
            name: "separator",
        },
        {
            name: rtl ? "addColumnAfter" : "addColumnBefore",
            tooltip: rtl ? dictionary.addColumnAfter : dictionary.addColumnBefore,
            icon: outline_icons_1.InsertLeftIcon,
            active: () => false,
        },
        {
            name: rtl ? "addColumnBefore" : "addColumnAfter",
            tooltip: rtl ? dictionary.addColumnBefore : dictionary.addColumnAfter,
            icon: outline_icons_1.InsertRightIcon,
            active: () => false,
        },
    ];
}
exports.default = tableMenuItems;
//# sourceMappingURL=table.js.map