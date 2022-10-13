import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

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
      "Mod-b": toggleMark(type),
      "Mod-B": toggleMark(type),
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
