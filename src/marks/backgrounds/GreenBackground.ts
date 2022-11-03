import markInputRule from "../../lib/markInputRule";
import Mark from "../Mark";
import markRule from "../../rules/mark";
import { toggleMarkBackground } from '../../commands/toggleMarkBackground';
import { GREEN_BACKGROUND_SHORTCUT } from '../../lib/constants';


export default class GreenBackground extends Mark {
  get name() {
    return "background_green";
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: "#E4FCD7",
        },
      },
      excludes: "background",
      group: "background",
      parseDOM: [
        {
          tag: `mark[data-type="background-green"]`,
        },
      ],
      toDOM: () => [
          "mark", 
          { 
            class: 'background green',
            'data-type': 'background-green',
          },
        ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:}})([^=]+)(?:}})$/, type)];
  }

  keys({ type }) {
    return {
      [ GREEN_BACKGROUND_SHORTCUT ]: toggleMarkBackground(type),
    };
  }

  commands({ type }) {
    return () => toggleMarkBackground(type);
  }

  get rulePlugins() {
    return [markRule({ delim: "}}", mark: "background_green" })];
  }

  get toMarkdown() {
    return {
      open: "}}",
      close: "}}",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "background_green" };
  }
}
