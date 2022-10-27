import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMarkBackground } from '../../commands/toggleMarkBackground';
import { BLUE_BACKGROUND_SHORTCUT } from '../../lib/constants';


export default class BlueBackground extends Mark {
  get name() {
    return "background_blue";
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
          tag: `mark[data-type="background-blue"]`,
        },
      ],
      toDOM: () => [
          "mark", 
          { 
            class: 'background blue',
            'data-type': 'background-blue',
          },
        ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:<<)([^=]+)(?:<<)$/, type)];
  }

  keys({ type }) {
    return {
      [ BLUE_BACKGROUND_SHORTCUT ]: toggleMarkBackground(type),
    };
  }

  commands({ type }) {
    return () => toggleMarkBackground(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "<<", mark: "background_blue" })];
  }

  get toMarkdown() {
    return {
      open: "<<",
      close: "<<",
      mixable: true,
      expelEnclosingWhitespace: true,
      escape: false,
    };
  }

  parseMarkdown() {
    return { mark: "background_blue" };
  }
}
