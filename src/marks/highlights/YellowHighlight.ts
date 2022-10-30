import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import applyHighlight from "../../commands/applyHighlight";

export default class YellowHighlight extends Mark {
  get name() {
    return "highlight_yellow";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#FFFCCF",
        },
      },
      excludes: "highlight",
      group: "highlight",
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => node.getAttribute("class") === "yellow",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "yellow",
        },
      ],
      toDOM: () => ["mark", { class: "yellow" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\$\$)([^=]+)(?:\$\$)$/, type)];
  }

  keys({ type }) {
    return {
      "Alt-Shift-3": applyHighlight(type),
    };
  }

  commands({ type }) {
    return () => applyHighlight(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "$$", mark: "highlight_yellow" })];
  }

  get toMarkdown() {
    return {
      open: "$$",
      close: "$$",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_yellow" };
  }
}
