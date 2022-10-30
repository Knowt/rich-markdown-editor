import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import applyHighlight from "../../commands/applyHighlight";

export default class DefaultHighlight extends Mark {
  get name() {
    return "highlight_default";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#FFDBDB",
        },
      },
      excludes: "highlight",
      group: "highlight",
      parseDOM: [
        {
          tag: "mark",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "red",
        },
      ],
      toDOM: () => ["mark", { class: "red" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:==)([^=]+)(?:==)$/, type)];
  }

  keys({ type }) {
    return {
      "Alt-Shift-1": applyHighlight(type),
    };
  }

  commands({ type }) {
    return () => applyHighlight(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "==", mark: "highlight_default" })];
  }

  get toMarkdown() {
    return {
      open: "==",
      close: "==",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_default" };
  }
}
