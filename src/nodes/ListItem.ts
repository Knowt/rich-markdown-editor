import { sinkListItem, liftListItem } from "prosemirror-schema-list";
import {
  Transaction,
  EditorState,
  Plugin,
  TextSelection,
} from "prosemirror-state";
import { DecorationSet, Decoration } from "prosemirror-view";
import Node from "./Node";
import isList from "../queries/isList";
import isInList from "../queries/isInList";
import getParentListItem from "../queries/getParentListItem";
import { customSplitListItem } from "../commands/customSplitListItem";
import { findParentNodeClosestToPos, replaceParentNodeOfType,
  findParentNode } from "@knowt/prosemirror-utils";

export default class ListItem extends Node {
  get name() {
    return "list_item";
  }

  get defaultOptions() {
    return {
      includeDrag: true,
    };
  }

  get schema() {
    return {
      content: "paragraph block*",
      defining: true,
      draggable: this.options.includeDrag,
      parseDOM: [{ tag: "li" }],
      toDOM: () => [
        "li",
        this.options.includeDrag ? { 
          class: this.options.includeDrag ? 'drag' : '' 
        } : {},
        0
      ],
    };
  }

  get plugins() {
    return [
      new Plugin({
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply: (
            tr: Transaction,
            set: DecorationSet,
            oldState: EditorState,
            newState: EditorState
          ) => {
            if ( this.options.includeDrag ) {
              const action = tr.getMeta("li");
              if (!action && !tr.docChanged) {
                return set;
              }
  
              // Adjust decoration positions to changes made by the transaction
              set = set.map(tr.mapping, tr.doc);
  
              switch (action?.event) {
                case "mouseover": {
                  const result = findParentNodeClosestToPos(
                    newState.doc.resolve(action.pos),
                    (node) =>
                      node.type.name === this.name ||
                      node.type.name === "checkbox_item"
                  );
  
                  if (!result) {
                    return set;
                  }
  
                  const list = findParentNodeClosestToPos(
                    newState.doc.resolve(action.pos),
                    (node) => isList(node, this.editor.schema)
                  );
  
                  if (!list) {
                    return set;
                  }
  
                  const start = list.node.attrs.order || 1;
  
                  let listItemNumber = 0;
                  list.node.content.forEach((li, _, index) => {
                    if (li === result.node) {
                      listItemNumber = index;
                    }
                  });
  
                  const counterLength = String(start + listItemNumber).length;
  
                  return set.add(tr.doc, [
                    Decoration.node(
                      result.pos,
                      result.pos + result.node.nodeSize,
                      {
                        class: `hovering`,
                      },
                      {
                        hover: true,
                      }
                    ),
                    Decoration.node(
                      result.pos,
                      result.pos + result.node.nodeSize,
                      {
                        class: `counter-${counterLength}`,
                      }
                    ),
                  ]);
                }
                case "mouseout": {
                  const result = findParentNodeClosestToPos(
                    newState.doc.resolve(action.pos),
                    (node) =>
                      node.type.name === this.name ||
                      node.type.name === "checkbox_item"
                  );
  
                  if (!result) {
                    return set;
                  }
  
                  return set.remove(
                    set.find(
                      result.pos,
                      result.pos + result.node.nodeSize,
                      (spec) => spec.hover
                    )
                  );
                }
                default:
              }
  
              return set;
            }
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleDOMEvents: {
            mouseover: (view, event) => {
              if ( this.options.includeDrag ) {
                const { state, dispatch } = view;
                const target = event.target as HTMLElement;
                const li = target?.closest("li");
  
                if (!li) {
                  return false;
                }
                if (!view.dom.contains(li)) {
                  return false;
                }
                const pos = view.posAtDOM(li, 0);
                if (!pos) {
                  return false;
                }
  
                dispatch(
                  state.tr.setMeta("li", {
                    event: "mouseover",
                    pos,
                  })
                );
                return false;
              }
            },
            mouseout: (view, event) => {
              if ( this.options.includeDrag ) {
                const { state, dispatch } = view;
                const target = event.target as HTMLElement;
                const li = target?.closest("li");
  
                if (!li) {
                  return false;
                }
                if (!view.dom.contains(li)) {
                  return false;
                }
                const pos = view.posAtDOM(li, 0);
                if (!pos) {
                  return false;
                }
  
                dispatch(
                  state.tr.setMeta("li", {
                    event: "mouseout",
                    pos,
                  })
                );
                return false;
              }
            },
          },
        },
      }),
    ];
  }

  keys({ type }) {
    return {
      Enter: customSplitListItem(type),
      Tab: sinkListItem(type),
      "Shift-Tab": liftListItem(type),
      "Mod-]": sinkListItem(type),
      "Mod-[": liftListItem(type),
      "Shift-Enter": (state, dispatch) => {
        if (!isInList(state)) return false;
        if (!state.selection.empty) return false;

        const { tr, selection } = state;
        dispatch(tr.split(selection.to));
        return true;
      },
      "Alt-ArrowUp": (state, dispatch) => {
        if (!state.selection.empty) return false;
        const result = getParentListItem(state);
        if (!result) return false;

        const [li, pos] = result;
        const $pos = state.doc.resolve(pos);

        if (
          !$pos.nodeBefore ||
          !["list_item", "checkbox_item"].includes($pos.nodeBefore.type.name)
        ) {
          console.log("Node before not a list item");
          return false;
        }

        const { tr } = state;
        const newPos = pos - $pos.nodeBefore.nodeSize;

        dispatch(
          tr
            .delete(pos, pos + li.nodeSize)
            .insert(newPos, li)
            .setSelection(TextSelection.near(tr.doc.resolve(newPos)))
        );
        return true;
      },
      "Alt-ArrowDown": (state, dispatch) => {
        if (!state.selection.empty) return false;
        const result = getParentListItem(state);
        if (!result) return false;

        const [li, pos] = result;
        const $pos = state.doc.resolve(pos + li.nodeSize);

        if (
          !$pos.nodeAfter ||
          !["list_item", "checkbox_item"].includes($pos.nodeAfter.type.name)
        ) {
          console.log("Node after not a list item");
          return false;
        }

        const { tr } = state;
        const newPos = pos + li.nodeSize + $pos.nodeAfter.nodeSize;

        dispatch(
          tr
            .insert(newPos, li)
            .setSelection(TextSelection.near(tr.doc.resolve(newPos)))
            .delete(pos, pos + li.nodeSize)
        );
        return true;
      },
      Backspace: (state: EditorState, dispatch) => {
        const { tr, selection, schema }  = state;

        const parentList = findParentNode((node) => isList(node, schema))(
          selection
        );
        const parentParagraph = findParentNode( ( node ) => node.type.name === 'paragraph' )(
          selection
        );

        if ( parentList ) {
          // TODO - this is a temp solution.
          // For some reason having a table as a prior node messed up list deletion.
          // This only happens if the list occurs at the END of the document.
          // To prevent the previous node from being focused, we manually check if backspace
          // occurs in a list item with no content.
          // NOTE - this happens only sometimes, which makes it even wierder
          if (   
            parentList.node.content.childCount === 1 &&
            parentList.node.content?.firstChild?.textContent === ''
          ) {
            const p = schema.nodes.paragraph.create();
  
            dispatch(
              replaceParentNodeOfType( parentList.node.type, p )( tr )
            );
            
            return true;
          }
          else if (
            parentParagraph &&
            parentParagraph.node.textContent &&
            selection.from === selection.to &&
            parentParagraph.start === selection.from
          ) {
            const parentListItem = findParentNode( 
              ( node ) => node.type.name === 'list_item' ||  node.type.name === 'checkbox_item' )(
              selection
            );

            if ( parentListItem ) {
              return liftListItem(parentListItem.node.type)(state, dispatch);
            }
          }
        }
      }
    };
  }

  toMarkdown(state, node) {
    state.renderContent(node);
  }

  parseMarkdown() {
    return { block: "list_item" };
  }
}
