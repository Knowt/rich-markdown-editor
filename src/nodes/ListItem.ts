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
import type { Node as ProsemirrorNode } from 'prosemirror-model';

export default class ListItem extends Node {
  get name() {
    return "list_item";
  }

  get schema() {
    return {
      content: "paragraph block*",
      defining: true,
      draggable: true,
      parseDOM: [{ tag: "li" }],
      toDOM: () => ["li", 0],
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
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleDOMEvents: {
            mouseover: (view, event) => {
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
            },
            mouseout: (view, event) => {
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
        const { tr, doc, selection, schema }  = state;

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
        else {
          // handles backspaces going to last list item 
          // when current selection is a paragraph
          if ( 
            parentParagraph &&
            selection.from === selection.to &&
            parentParagraph.start === selection.from
          ) {
            const newPos = doc.resolve( selection.from - 2 );
            const prevList = findParentNodeClosestToPos( 
              newPos, 
              ( node ) => isList( node, schema ) 
            );

            if ( prevList ) {
              const steps = this.getLastListItemDepth( prevList.node );
              const lastListItemPos = selection.from - 4 - steps * 2;
              const paragraphText = parentParagraph.node.textContent;

              try {
                dispatch(
                  tr.deleteRange(
                    selection.from,
                    // +2 handles deletion of line
                    selection.from + paragraphText.length + 2,
                  )
                  .insertText( paragraphText, lastListItemPos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( lastListItemPos )
                  ) )
                );
              }
              // edge case for if writing on bottom of doc and there is no line to delete
              catch {
                dispatch(
                  tr.delete(
                    selection.from,
                    selection.from + paragraphText.length,
                  )
                  .insertText( paragraphText, lastListItemPos )
                  .setSelection( TextSelection.near(
                    tr.doc.resolve( lastListItemPos )
                  ) )
                );
              }
              return true;
            }
          }
        }
      }
    };
  }

  getLastListItemDepth( node: ProsemirrorNode ) {
    let depth = 0;

    const traverseList = ( node: ProsemirrorNode ) => {
      try {
        // @ts-ignore
        const innerNodes = node.content.content as ProsemirrorNode[];
        const lastListItem = innerNodes[ innerNodes.length - 1 ];
        // @ts-ignore
        const lastListItemContent = lastListItem.content.content as ProsemirrorNode[];

        // when the last list item has another list inside of it as the second element
        if ( lastListItemContent.length === 2 ) {
          depth += 1;

          traverseList( lastListItemContent[ lastListItemContent.length - 1 ] );
        }
      }
      catch ( error ) {
        console.warn( error );

        return depth;
      }
    }

    traverseList( node );

    return depth;
  }

  toMarkdown(state, node) {
    state.renderContent(node);
  }

  parseMarkdown() {
    return { block: "list_item" };
  }
}
