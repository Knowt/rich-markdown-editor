import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMark } from "prosemirror-commands";
import { RED_HIGHLIGHT_SHORTCUT } from '../../lib/constants';

export default class RedHighlight extends Mark {
  get name() {
    return "highlight_red";
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
          getAttrs: (node) => node.getAttribute("class") === "red highlight",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "red",
        },
      ],
      toDOM: () => ["mark", { class: "red highlight" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:==)([^=]+)(?:==)$/, type)];
  }

  keys({ type }) {
    return {
      [ RED_HIGHLIGHT_SHORTCUT ]: toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "==", mark: "highlight_red" })];
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
    return { mark: "highlight_red" };
  }
}
