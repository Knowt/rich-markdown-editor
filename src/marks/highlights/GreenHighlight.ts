import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import applyHighlight from "../../commands/applyHighlight";

export default class GreenHighlight extends Mark {
  get name() {
    return "highlight_green";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#E4FCD7",
        },
      },
      excludes: "highlight",
      group: "highlight",
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => node.getAttribute("class") === "green",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "green",
        },
      ],
      toDOM: () => ["mark", { class: "green" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:%%)([^=]+)(?:%%)$/, type)];
  }

  keys({ type }) {
    return {
      "Alt-Shift-4": applyHighlight(type),
    };
  }

  commands({ type }) {
    return () => applyHighlight(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "%%", mark: "highlight_green" })];
  }

  get toMarkdown() {
    return {
      open: "%%",
      close: "%%",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_green" };
  }
}
