"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconClasses = void 0;
const getIconClasses = (shouldLightIcon) => {
    let iconClasses = 'icon';
    if (shouldLightIcon) {
        iconClasses += ' light';
    }
    return iconClasses;
};
exports.getIconClasses = getIconClasses;
//# sourceMappingURL=getIconClasses.js.map