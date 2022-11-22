import { Schema, Node as ProsemirrorNode, DOMSerializer } from 'prosemirror-model';
import ExtensionManager from "./lib/ExtensionManager";
// marks
import Bold from "./marks/Bold";
import Code from "./marks/Code";
import RedHighlight from "./marks/highlights/RedHighlight";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import { BlueBackground, RedBackground,
  OrangeBackground, YellowBackground,
  GreenBackground } from './marks/backgrounds';
import Italic from "./marks/Italic";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
// nodes
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import BulletList from "./nodes/BulletList";
import ListItem from "./nodes/ListItem";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
// plugins
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";
export { default as Extension } from "./lib/Extension";

export const getFlashcardSerializerExtensions = () => {
  return [
    new Doc(),
    new Paragraph(),
    new Text(),
    new OrderedList(),
    new BulletList(),
    new ListItem({
      includeDrag: false,
    }),
    new BlueBackground(),
    new RedBackground(),
    new OrangeBackground(),
    new YellowBackground(),
    new GreenBackground(),
    new Bold(),
    new Code(),
    new OrangeHighlight(),
    new YellowHighlight(),
    new BlueHighlight(),
    new GreenHighlight(),
    new RedHighlight(),
    new Italic(),
    new Underline(),
    new Strikethrough(),
  ]
}

type FlashcardMdToHtmlInput = {
  extensions: ExtensionManager;
  markdown: string;
}

export const flashcardMdToHtml = (
  input: FlashcardMdToHtmlInput,
) => {
  const { extensions, markdown } = input;
  const schema = new Schema({
    nodes: extensions.nodes,
    marks: extensions.marks,
  });
  const domSerializer = DOMSerializer.fromSchema(schema);
  const markdownParser = extensions.parser({
    schema,
    plugins: extensions.rulePlugins,
  });

  const doc = markdownParser.parse(markdown) as ProsemirrorNode;

  const serializedFragment = domSerializer.serializeFragment(doc.content, {
    document,
  });
  const throwAwayDiv = document.createElement("div");
  throwAwayDiv.appendChild(serializedFragment);

  return throwAwayDiv.innerHTML;
}

type GetFlashcardEditorExtensionsInput = {
  maxLength?: number;
}

export const getFlashcardEditorExtensions = (
  input: GetFlashcardEditorExtensionsInput,
) => {
  const { maxLength } = input;

  return {
      baseExtensions: [
      new Doc(),
      new Paragraph(),
      new Text(),
      new OrderedList(),
      new BulletList(),
      new ListItem({
        includeDrag: false,
      }),
      // backgrounds take precedence over other marks
      // this makes all below marks wrapped inside the background mark
      // do not change order of these marks unless you know what you are doing
      new BlueBackground(),
      new RedBackground(),
      new OrangeBackground(),
      new YellowBackground(),
      new GreenBackground(),
      new Bold(),
      new Code(),
      new OrangeHighlight(),
      new YellowHighlight(),
      new BlueHighlight(),
      new GreenHighlight(),
      new RedHighlight(), // the order matters here!! since it's the default marker
      new Italic(),
      new TemplatePlaceholder(),
      new Underline(),
      new Strikethrough(),
      new History(),
      new SmartText(),
      new PasteHandler(),
      new MaxLength({
        maxLength,
      }),
    ],
    getPlaceholderExtension: ( placeholder: string ) => (
      new Placeholder({
        placeholder,
      })
    ),
  }
}