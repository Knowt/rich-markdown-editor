import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";
import { ITALIC_SHORTCUT1, ITALIC_SHORTCUT2 } from '../lib/constants';

export default class Italic extends Mark {
  get name() {
    return "em";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style", getAttrs: value => value === "italic" },
      ],
      toDOM: () => ["em"],
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:^|[\s])(_([^_]+)_)$/, type),
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, type),
    ];
  }

  keys({ type }) {
    return {
      [ ITALIC_SHORTCUT1 ]: toggleMark(type),
      [ ITALIC_SHORTCUT2 ]: toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "em" };
  }
}
