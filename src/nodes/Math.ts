import {
  chainCommands,
  deleteSelection,
  selectNodeBackward,
  joinBackward,
} from "prosemirror-commands";
import {
  mathPlugin,
  mathBackspaceCmd,
  insertMathCmd,
  makeInlineMathInputRule,
  REGEX_INLINE_MATH_DOLLARS,
} from "@benrbray/prosemirror-math";
import Node from "./Node";
import "katex/dist/katex.min.css";
import "@benrbray/prosemirror-math/style/math.css";

export default class Math extends Node {
  get name() {
    return "math_inline";
  }

  get schema() {
    return {
      group: "inline math",
      content: "text*",
      inline: true,
      atom: true,
      toDOM: () => [
        "math-inline",
        { class: "math-node", spellcheck: "false" },
        0,
      ],
      parseDOM: [
        {
          tag: "math-inline",
        },
      ],
    };
  }

  inputRules({ schema }) {
    return [
      makeInlineMathInputRule(
        REGEX_INLINE_MATH_DOLLARS,
        schema.nodes.math_inline
      ),
    ];
  }

  keys({ schema }) {
    return {
      "Mod-Space": insertMathCmd(schema.nodes.math_inline),
      Backspace: chainCommands(
        deleteSelection,
        mathBackspaceCmd,
        joinBackward,
        selectNodeBackward
      ),
    };
  }

  get plugins() {
    return [mathPlugin];
  }

  toMarkdown(state, node) {
    state.write("$");
    state.renderInline(node);
    state.write("$");
  }

  parseMarkdown() {
    return {
      node: "math_inline",
    };
  }
}
