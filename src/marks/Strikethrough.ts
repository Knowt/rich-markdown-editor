import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";
import {
  STRIKETHROUGH_SHORTCUT1,
  STRIKETHROUGH_SHORTCUT2,
} from "../lib/constants";

export default class Strikethrough extends Mark {
  get name() {
    return "strikethrough";
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: "s",
        },
        {
          tag: "del",
        },
        {
          tag: "strike",
        },
      ],
      toDOM: () => ["del", 0],
    };
  }

  keys({ type }) {
    return {
      [STRIKETHROUGH_SHORTCUT1]: toggleMark(type),
      [STRIKETHROUGH_SHORTCUT2]: toggleMark(type),
    };
  }

  inputRules({ type }) {
    return [markInputRule(/~([^~]+)~$/, type)];
  }

  get toMarkdown() {
    return {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  get markdownToken() {
    return "s";
  }

  parseMarkdown() {
    return { mark: "strikethrough" };
  }
}
