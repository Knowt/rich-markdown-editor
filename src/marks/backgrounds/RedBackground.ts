import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMark } from "prosemirror-commands";
import { RED_BACKGROUND_SHORTCUT } from '../../lib/constants';


export default class RedBackground extends Mark {
  get name() {
    return "background_red";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#FFDBDB",
        },
      },
      excludes: "background",
      group: "background",
      parseDOM: [
        {
          tag: `mark[data-type="background-red"]`,
        },
      ],
      toDOM: () => [
          "mark", 
          { 
            class: 'background red',
            'data-type': 'background-red',
          },
        ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\[\[)([^=]+)(?:\[\[)$/, type)];
  }

  keys({ type }) {
    return {
      [ RED_BACKGROUND_SHORTCUT ]: toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "[[", mark: "background_red" })];
  }

  get toMarkdown() {
    return {
      open: "[[",
      close: "[[",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "background_red" };
  }
}
