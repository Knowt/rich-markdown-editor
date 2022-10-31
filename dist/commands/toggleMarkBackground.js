"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleMarkBackground = void 0;
function markApplies(doc, ranges, type) {
    for (let i = 0; i < ranges.length; i++) {
        let { $from, $to } = ranges[i];
        let can = $from.depth == 0 ? doc.inlineContent && doc.type.allowsMarkType(type) : false;
        doc.nodesBetween($from.pos, $to.pos, node => {
            if (can)
                return false;
            can = node.inlineContent && node.type.allowsMarkType(type);
        });
        if (can)
            return true;
    }
    return false;
}
const toggleMarkBackground = (markType, attrs = null) => {
    return function (state, dispatch) {
        let { empty, $cursor, ranges } = state.selection;
        if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType))
            return false;
        if (dispatch) {
            if ($cursor) {
                if (markType.isInSet(state.storedMarks || $cursor.marks()))
                    dispatch(state.tr.removeStoredMark(markType));
                else
                    dispatch(state.tr.addStoredMark(markType.create(attrs)));
            }
            else {
                let has = false, tr = state.tr;
                for (let i = 0; !has && i < ranges.length; i++) {
                    let { $from, $to } = ranges[i];
                    has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
                }
                for (let i = 0; i < ranges.length; i++) {
                    let { $from, $to } = ranges[i];
                    const extendedStart = $from.pos - $from.parentOffset;
                    const extendedEnd = $to.pos + $to.parent.content.size - $to.parentOffset;
                    if (has) {
                        try {
                            tr.removeMark(extendedStart, extendedEnd, markType);
                        }
                        catch (_a) {
                            tr.removeMark(extendedStart, $to.pos, markType);
                        }
                    }
                    else {
                        const start = $from.nodeAfter, end = $to.nodeBefore;
                        const spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0;
                        const spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0;
                        const handleAddMark = (from, to) => {
                            let newFrom = from, newTo = to;
                            if (newFrom + spaceStart < newTo) {
                                newFrom += spaceStart;
                                newTo -= spaceEnd;
                            }
                            tr.addMark(newFrom, newTo, markType.create(attrs));
                        };
                        try {
                            handleAddMark(extendedStart, extendedEnd);
                        }
                        catch (_b) {
                            handleAddMark(extendedStart, $to.pos);
                        }
                    }
                }
                dispatch(tr.scrollIntoView());
            }
        }
        return true;
    };
};
exports.toggleMarkBackground = toggleMarkBackground;
//# sourceMappingURL=toggleMarkBackground.js.map