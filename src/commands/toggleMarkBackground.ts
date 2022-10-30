import { MarkType, Attrs, Node } from 'prosemirror-model';
import { SelectionRange, TextSelection, Command } from 'prosemirror-state';


function markApplies(doc: Node, ranges: readonly SelectionRange[], type: MarkType) {
  for (let i = 0; i < ranges.length; i++) {
    let {$from, $to} = ranges[i]
    let can = $from.depth == 0 ? doc.inlineContent && doc.type.allowsMarkType(type) : false
    doc.nodesBetween($from.pos, $to.pos, node => {
    if (can) return false
    can = node.inlineContent && node.type.allowsMarkType(type)
    })
    if (can) return true
  }
  return false
}

/**
 * Adaptation of toggleMark -> https://github.com/ProseMirror/prosemirror-commands/blob/5ba52769680ab2100b6ad0319e0d7e799668d9a4/src/commands.ts#L505
 * Used to wrap ENTIRE row regardless of text selection in background.
 * This is a nice feature AND is needed in for the heading node to function prooperly
 */
export const toggleMarkBackground = (markType: MarkType, attrs: Attrs | null = null): Command => {
  return function(state, dispatch) {
    let {empty, $cursor, ranges} = state.selection as TextSelection
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks()))
          dispatch(state.tr.removeStoredMark(markType))
        else
          dispatch(state.tr.addStoredMark(markType.create(attrs)))
      } else {
        let has = false, tr = state.tr
        for (let i = 0; !has && i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
        }
        for (let i = 0; i < ranges.length; i++) {
          let {$from, $to} = ranges[i]
          const extendedStart = $from.pos - $from.parentOffset;
          const extendedEnd = $to.pos + $to.parent.content.size - $to.parentOffset;

          if (has) {
            try {
              tr.removeMark(
                extendedStart, 
                extendedEnd, 
                markType,
              )
            }
            catch {
              tr.removeMark(
                extendedStart, 
                $to.pos, 
                markType,
              )
            }
          } else {
            const start = $from.nodeAfter, end = $to.nodeBefore
            const spaceStart = start && start.isText ? /^\s*/.exec(start.text!)![0].length : 0
            const spaceEnd = end && end.isText ? /\s*$/.exec(end.text!)![0].length : 0

            const handleAddMark = ( from: number, to: number ) => {
              let newFrom = from, newTo = to;
              if (newFrom + spaceStart < newTo) { newFrom += spaceStart; newTo -= spaceEnd }

              tr.addMark(
                newFrom, 
                newTo, 
                markType.create(attrs)
              )
            }

            try {
              handleAddMark( extendedStart, extendedEnd );
            }
            catch {
              handleAddMark( extendedStart, $to.pos );
            }
          }
        }
        dispatch(tr.scrollIntoView())
      }
    }
    return true
  }
}