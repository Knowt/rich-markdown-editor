import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";
import { BOLD_SHORTCUT1, BOLD_SHORTCUT2 } from '../lib/constants';

export default class Bold extends Mark {
  get name() {
    return "strong";
  }

  get schema() {
    return {
      parseDOM: [
        // TODO: comment b tag for now, as it's causing a problem when copying from google docs
        // { tag: "b" },
        { tag: "strong" },
        { style: "font-style", getAttrs: (value) => value === "bold" },
        {
          style: "font-weight",
          getAttrs: (value) =>
            ["700", "800", "900", "bold", "bolder"].includes(value),
        },
      ],
      toDOM: () => ["strong"],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*)([^*]+)(?:\*\*)$/, type)];
  }

  keys({ type }) {
    return {
      [ BOLD_SHORTCUT1 ]: toggleMark(type),
      [ BOLD_SHORTCUT2 ]: toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "strong" };
  }
}
