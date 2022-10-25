import Node from "./Node";
import { Decoration, DecorationSet } from "prosemirror-view";
import {
  addColumnAfter,
  addColumnBefore,
  deleteColumn,
  deleteRow,
  deleteTable,
  fixTables,
  goToNextCell,
  setCellAttr,
  tableEditing,
  toggleHeaderCell,
  toggleHeaderColumn,
  toggleHeaderRow,
  addRowAfter,
  addRowBefore,
} from "@knowt/prosemirror-tables";
import {
  createTable,
  getCellsInColumn,
} from "@knowt/prosemirror-utils";
import { Plugin, TextSelection } from "prosemirror-state";
import tablesRule from "../rules/tables";

export default class Table extends Node {
  get name() {
    return "table";
  }

  get schema() {
    return {
      content: "tr+",
      tableRole: "table",
      isolating: true,
      group: "block",
      parseDOM: [{ tag: "table" }],
      toDOM() {
        return [
          "div",
          { class: "scrollable-wrapper" },
          [
            "div",
            { class: "scrollable" },
            ["table", { class: "rme-table" }, ["tbody", 0]],
          ],
        ];
      },
    };
  }

  get rulePlugins() {
    return [tablesRule];
  }

  commands({ schema }) {
    return {
      createTable:
        ({ rowsCount, colsCount }) =>
        (state, dispatch) => {
          const offset = state.tr.selection.anchor + 1;
          const nodes = createTable(schema, rowsCount, colsCount);
          const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
          const resolvedPos = tr.doc.resolve(offset);

          tr.setSelection(TextSelection.near(resolvedPos));
          dispatch(tr);
        },
      setColumnAttr:
        ({ index, alignment }) =>
        (state, dispatch) => {
          const cells = getCellsInColumn(index)(state.selection) || [];
          let transaction = state.tr;
          cells.forEach(({ pos }) => {
            transaction = transaction.setNodeMarkup(pos, null, {
              alignment,
            });
          });
          dispatch(transaction);
        },
      addColumnBefore: () => addColumnBefore,
      addColumnAfter: () => addColumnAfter,
      deleteColumn: () => deleteColumn,
      addRowBefore: () => addRowBefore,
      addRowAfter: () => addRowAfter,
      deleteRow: () => deleteRow,
      deleteTable: () => deleteTable,
      toggleHeaderColumn: () => toggleHeaderColumn,
      toggleHeaderRow: () => toggleHeaderRow,
      toggleHeaderCell: () => toggleHeaderCell,
      setCellAttr: () => setCellAttr,
      fixTables: () => fixTables,
    };
  }

  keys() {
    return {
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1),
    };
  }

  toMarkdown(state, node) {
    state.renderTable(node);
    state.closeBlock(node);
  }

  parseMarkdown() {
    return { block: "table" };
  }

  get plugins() {
    return [
      tableEditing(),
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            let index = 0;

            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;

              const elements = document.getElementsByClassName("rme-table");
              const table = elements[index];
              if (!table) return;

              const element = table.parentElement;
              const shadowRight = !!(
                element && element.scrollWidth > element.clientWidth
              );

              if (shadowRight) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const shadow = document.createElement("div");
                    shadow.className = "scrollable-shadow right";
                    return shadow;
                  })
                );
              }
              index++;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  }
}
