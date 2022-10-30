import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";
import underlinesRule from "../rules/underlines";
import { UNDERLINE_SHORTCUT1, UNDERLINE_SHORTCUT2 } from '../lib/constants';

export default class Underline extends Mark {
  get name() {
    return "underline";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "u" },
        { tag: "underline" },
        {
          style: "text-decoration",
          getAttrs: (value) => value === "underline",
        },
      ],
      toDOM: () => ["u", 0],
    };
  }

  get rulePlugins() {
    return [underlinesRule];
  }

  inputRules({ type }) {
    return [markInputRule(/(?:__)([^_]+)(?:__)$/, type)];
  }

  keys({ type }) {
    return {
      [ UNDERLINE_SHORTCUT1 ]: toggleMark(type),
      [ UNDERLINE_SHORTCUT2 ]: toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: "__",
      close: "__",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "underline" };
  }
}
