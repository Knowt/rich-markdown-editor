import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import applyHighlight from "../../commands/applyHighlight";

export default class BlueHighlight extends Mark {
  get name() {
    return "highlight_blue";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#D9EDFF",
        },
      },
      excludes: "highlight",
      group: "highlight",
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (node) => node.getAttribute("class") === "blue",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "blue",
        },
      ],
      toDOM: () => ["mark", { class: "blue" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\^\^)([^=]+)(?:\^\^)$/, type)];
  }

  keys({ type }) {
    return {
      "Alt-Shift-5": applyHighlight(type),
    };
  }

  commands({ type }) {
    return () => applyHighlight(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "^^", mark: "highlight_blue" })];
  }

  get toMarkdown() {
    return {
      open: "^^",
      close: "^^",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight_blue" };
  }
}
