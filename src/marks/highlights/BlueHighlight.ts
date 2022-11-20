import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMark } from "prosemirror-commands";
import { BLUE_HIGHLIGHT_SHORTCUT } from '../../lib/constants';


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
          getAttrs: (node) => node.getAttribute("class") === "blue highlight",
        },
        {
          style: "background-color",
          getAttrs: (value) => !!value && value === "blue",
        },
      ],
      toDOM: () => ["mark", { class: "blue highlight" }],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\^\^)([^=]+)(?:\^\^)$/, type)];
  }

  keys({ type }) {
    return {
      [ BLUE_HIGHLIGHT_SHORTCUT ]: toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
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
