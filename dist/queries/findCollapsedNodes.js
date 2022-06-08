"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
function findCollapsedNodes(doc) {
    const blocks = prosemirror_utils_1.findBlockNodes(doc);
    const nodes = [];
    let withinCollapsedHeading;
    for (const block of blocks) {
        if (block.node.type.name === "heading") {
            if (!withinCollapsedHeading ||
                block.node.attrs.level <= withinCollapsedHeading) {
                if (block.node.attrs.collapsed) {
                    if (!withinCollapsedHeading) {
                        withinCollapsedHeading = block.node.attrs.level;
                    }
                }
                else {
                    withinCollapsedHeading = undefined;
                }
                continue;
            }
        }
        if (withinCollapsedHeading) {
            nodes.push(block);
        }
    }
    return nodes;
}
exports.default = findCollapsedNodes;
//# sourceMappingURL=findCollapsedNodes.js.map