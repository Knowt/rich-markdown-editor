"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterExcessSeparators(items) {
    return items.reduce((acc, item, index) => {
        if (item.name === "separator" && index === 0)
            return acc;
        if (item.name === "separator" && index === items.length - 1)
            return acc;
        const next = items[index + 1];
        if (next && next.name === "separator" && item.name === "separator")
            return acc;
        return [...acc, item];
    }, []);
}
exports.default = filterExcessSeparators;
//# sourceMappingURL=filterExcessSeparators.js.map