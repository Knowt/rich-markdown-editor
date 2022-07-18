import { Selection } from "prosemirror-state";

const isSelectionEmpty = (selection: Selection) => {
  const slice = selection.content();
  const fragment = slice.content;

  let isEmpty = true;

  fragment.descendants((node) => {
    if (node.textContent.trim() !== "") {
      isEmpty = false;
      return false;
    }
  });

  return isEmpty;
};

export default isSelectionEmpty;
