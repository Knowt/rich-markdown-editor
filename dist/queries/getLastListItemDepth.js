"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastListItemDepth = void 0;
const getLastListItemDepth = (node) => {
    let depth = 0;
    const traverseList = (node) => {
        try {
            const innerNodes = node.content.content;
            const lastListItem = innerNodes[innerNodes.length - 1];
            const lastListItemContent = lastListItem.content.content;
            if (lastListItemContent.length === 2) {
                depth += 1;
                traverseList(lastListItemContent[lastListItemContent.length - 1]);
            }
        }
        catch (error) {
            console.warn(error);
            return depth;
        }
    };
    traverseList(node);
    return depth;
};
exports.getLastListItemDepth = getLastListItemDepth;
//# sourceMappingURL=getLastListItemDepth.js.map