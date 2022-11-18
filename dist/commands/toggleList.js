"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const prosemirror_utils_1 = require("@knowt/prosemirror-utils");
const isList_1 = __importDefault(require("../queries/isList"));
const prosemirror_utils_2 = require("@knowt/prosemirror-utils");
function toggleList(listType, itemType) {
    return (state, dispatch) => {
        var _a;
        const { schema, selection } = state;
        const { $from, $to } = selection;
        const range = $from.blockRange($to);
        if (!range) {
            return false;
        }
        const parentList = prosemirror_utils_1.findParentNode((node) => isList_1.default(node, schema))(selection);
        if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
            if (parentList.node.type === listType) {
                return prosemirror_schema_list_1.liftListItem(itemType)(state, dispatch);
            }
            if (isList_1.default(parentList.node, schema)) {
                try {
                    const convertListItemContent = (content, outerList) => {
                        let newContent = undefined;
                        content.forEach((node, index) => {
                            var _a, _b, _c, _d;
                            const newItem = itemType.create(undefined, node.content);
                            const contentToUse = newContent || outerList;
                            newContent = contentToUse.replaceChild(index, newItem);
                            if (((_d = (_c = (_b = (_a = newContent === null || newContent === void 0 ? void 0 : newContent.content) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d[1]) &&
                                isList_1.default(newContent.content[index].content.content[1], state.schema)) {
                                newContent.content[index].content = newContent.content[index].content.replaceChild(1, convertListItemContent(newContent.content[index].content.content[1].content.content, newContent.content[index].content.content[1].content));
                            }
                        });
                        return listType.create(undefined, newContent);
                    };
                    const newList = convertListItemContent((_a = parentList.node.content) === null || _a === void 0 ? void 0 : _a.content, parentList.node.content);
                    if (dispatch) {
                        dispatch(prosemirror_utils_2.replaceParentNodeOfType(parentList.node.type, newList)(state.tr));
                    }
                    return false;
                }
                catch (error) {
                    console.warn(`Could not convert list from ${parentList.node.type.name} to ${listType.name}`);
                    if (listType.validContent(parentList.node.content)) {
                        const { tr } = state;
                        tr.setNodeMarkup(parentList.pos, listType);
                        if (dispatch) {
                            dispatch(tr);
                        }
                        return false;
                    }
                }
            }
        }
        return prosemirror_schema_list_1.wrapInList(listType)(state, dispatch);
    };
}
exports.default = toggleList;
//# sourceMappingURL=toggleList.js.map