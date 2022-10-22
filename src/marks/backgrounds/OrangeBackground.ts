import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMark } from "prosemirror-commands";
import { ORANGE_BACKGROUND_SHORTCUT } from '../../lib/constants';


export default class OrangeBackground extends Mark {
  get name() {
    return "background_orange";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#D9EDFF",
        },
      },
      excludes: "background",
      group: "background",
      parseDOM: [
        {
          tag: `mark[data-type="background-orange"]`,
        },
      ],
      toDOM: () => [
          "mark", 
          { 
            class: 'background orange',
            'data-type': 'background-orange',
          },
        ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\]\])([^=]+)(?:\]\])$/, type)];
  }

  keys({ type }) {
    return {
      [ ORANGE_BACKGROUND_SHORTCUT ]: toggleMark(type),
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "]]", mark: "background_orange" })];
  }

  get toMarkdown() {
    return {
      open: "]]",
      close: "]]",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "background_orange" };
  }
}
