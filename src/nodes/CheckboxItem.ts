import { sinkListItem, liftListItem } from "prosemirror-schema-list";
import Node from "./Node";
import checkboxRule from "../rules/checkboxes";
import { customSplitListItem } from "../commands/customSplitListItem";

export default class CheckboxItem extends Node {
  get name() {
    return "checkbox_item";
  }

  get defaultOptions() {
    return {
      includeDrag: true,
    }
  }

  get schema() {
    return {
      attrs: {
        checked: {
          default: false
        }
      },
      content: "paragraph block*",
      defining: true,
      draggable: this.options.includeDrag,
      parseDOM: [
        {
          tag: `li[data-type="${this.name}"]`,
          getAttrs: (dom: HTMLLIElement) => ({
            checked: dom.className.includes("checked")
          })
        }
      ],
      toDOM: (node) => {
        const isServer = typeof document === "undefined";
        let input;
        if (isServer) {
          input = [
            "input",
            {
              type: "checkbox",
              tabindex: -1,
              contentEditable: false,
              ...(node.attrs.checked  && { checked: true } ),
            }
          ]
        } else {
          input = document.createElement("input");
          input.type = "checkbox";
          input.tabIndex = -1;
          input.contentEditable = false;
          input.addEventListener("change", this.handleChange);
          if (node.attrs.checked) {
            input.checked = true;
          }
        }

        let className: string = '';

        if ( node.attrs.checked ) {
          className += 'checked';
        }

        if ( this.options.includeDrag ) {
          className += 'drag';
        }

        const attrs: { [ key: string ]: any } = {
          "data-type": this.name,
        }

        if ( className ) {
          attrs.class = className;
        }

        return [
          "li",
          attrs,
          input,
          ["div", 0]
        ];
      }
    };
  }

  get rulePlugins() {
    return [checkboxRule];
  }

  handleChange = (event) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const { top, left } = event.target.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        checked: event.target.checked
      });
      view.dispatch(transaction);
    }
  };

  keys({ type }) {
    return {
      Enter: customSplitListItem(type),
      Tab: sinkListItem(type),
      "Shift-Tab": liftListItem(type),
      "Mod-]": sinkListItem(type),
      "Mod-[": liftListItem(type)
    };
  }

  toMarkdown(state, node) {
    state.write(node.attrs.checked ? "[x] " : "[ ] ");
    state.renderContent(node);
  }

  parseMarkdown() {
    return {
      block: "checkbox_item",
      getAttrs: (tok) => ({
        checked: tok.attrGet("checked") ? true : undefined
      })
    };
  }
}
