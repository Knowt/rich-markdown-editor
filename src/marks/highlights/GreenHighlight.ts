import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMark } from "prosemirror-commands";
import { GREEN_HIGHLIGHT_SHORTCUT } from '../../lib/constants';

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
          getAttrs: (node) => node.getAttribute("class") === "green highlight",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "green",
        },
      ],
      toDOM: () => ["mark", { class: "green highlight" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:%%)([^=]+)(?:%%)$/, type)];
  }

  keys({ type }) {
    return {
      [ GREEN_HIGHLIGHT_SHORTCUT ]: toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
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
