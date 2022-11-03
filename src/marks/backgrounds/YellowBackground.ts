import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMarkBackground } from '../../commands/toggleMarkBackground';
import { YELLOW_BACKGROUND_SHORTCUT } from '../../lib/constants';


export default class YellowBackground extends Mark {
  get name() {
    return "background_yellow";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#FFFCCF",
        },
      },
      excludes: "background",
      group: "background",
      parseDOM: [
        {
          tag: `mark[data-type="background-yellow"]`,
        },
      ],
      toDOM: () => [
          "mark", 
          { 
            class: 'background yellow',
            'data-type': 'background-yellow',
          },
        ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:{{)([^=]+)(?:{{)$/, type)];
  }

  keys({ type }) {
    return {
      [ YELLOW_BACKGROUND_SHORTCUT ]: toggleMarkBackground(type),
    };
  }

  commands({ type }) {
    return () => toggleMarkBackground(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "{{", mark: "background_yellow" })];
  }

  get toMarkdown() {
    return {
      open: "{{",
      close: "{{",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "background_yellow" };
  }
}
