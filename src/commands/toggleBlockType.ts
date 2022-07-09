// import { setBlockType } from "prosemirror-commands";
import { Slice, Fragment } from "@knowt/prosemirror-model";
import { ReplaceAroundStep } from "prosemirror-transform";
import isNodeActive from "../queries/isNodeActive";

function canChangeType(doc, pos, type) {
  const $pos = doc.resolve(pos),
    index = $pos.index();
  return $pos.parent.canReplaceWith(index, index + 1, type);
}

function setBlockType2(from, to = from, type, attrs) {
  if (!type.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  const mapFrom = this.steps.length;
  this.doc.nodesBetween(from, to, (node, pos) => {
    if (
      node.isTextblock &&
      !node.hasMarkup(type, attrs) &&
      canChangeType(this.doc, this.mapping.slice(mapFrom).map(pos), type)
    ) {
      // Ensure all markup that isn't allowed in the new node type is cleared
      this.clearIncompatible(this.mapping.slice(mapFrom).map(pos, 1), type);
      const mapping = this.mapping.slice(mapFrom);
      const startM = mapping.map(pos, 1),
        endM = mapping.map(pos + node.nodeSize, 1);
      this.step(
        new ReplaceAroundStep(
          startM,
          endM,
          startM + 1,
          endM - 1,
          new Slice(Fragment.from(type.create(attrs, null, node.marks)), 0, 0),
          1,
          true
        )
      );
      return false;
    }
  });
  return this;
}

function setBlockType(nodeType, attrs = {}) {
  return function (state, dispatch) {
    const { from, to } = state.selection;
    let applicable = false;

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (applicable) return false;
      if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
      if (node.type === nodeType) {
        applicable = true;
      } else {
        const $pos = state.doc.resolve(pos),
          index = $pos.index();
        applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
      }
    });

    if (!applicable) return false;

    dispatch(
      setBlockType2.call(state.tr, from, to, nodeType, attrs).scrollIntoView()
    );

    return true;
  };
}

export default function toggleBlockType(type, toggleType, attrs = {}) {
  return (state, dispatch) => {
    const isActive = isNodeActive(type, attrs)(state);

    if (isActive) {
      return setBlockType(toggleType)(state, dispatch);
    }

    return setBlockType(type, attrs)(state, dispatch);
  };
}
