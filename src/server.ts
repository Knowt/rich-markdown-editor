/* Not quite a server file, it has to be run in the browser, 
as it uses browser API to serialize the prosemirror doc AST to html */

import {
  Schema,
  DOMParser,
  DOMSerializer,
  Node as ProsemirrorNode,
} from "prosemirror-model";
import ExtensionManager from "./lib/ExtensionManager";
import baseDictionary from "./dictionary";

// nodes
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Blockquote from "./nodes/Blockquote";
import Emoji from "./nodes/Emoji";
import BulletList from "./nodes/BulletList";
import CodeBlock from "./nodes/CodeBlock";
import CodeFence from "./nodes/CodeFence";
import CheckboxList from "./nodes/CheckboxList";
import CheckboxItem from "./nodes/CheckboxItem";
import Embed from "./nodes/Embed";
import HardBreak from "./nodes/HardBreak";
import Heading from "./nodes/Heading";
import HorizontalRule from "./nodes/HorizontalRule";
import Image from "./nodes/Image";
import ListItem from "./nodes/ListItem";
import Notice from "./nodes/Notice";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
import Table from "./nodes/Table";
import TableCell from "./nodes/TableCell";
import TableHeadCell from "./nodes/TableHeadCell";
import TableRow from "./nodes/TableRow";

// marks
import Bold from "./marks/Bold";
import Code from "./marks/Code";
import Italic from "./marks/Italic";
import Link from "./marks/Link";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import RedHighlight from "./marks/highlights/RedHighlight";
import { BlueBackground, RedBackground,
  OrangeBackground, YellowBackground,
  GreenBackground } from './marks/backgrounds';
import { isHTML } from "./domHelpers";

const extensions = new ExtensionManager([
  new Doc(),
  new Text(),
  new HardBreak(),
  new Paragraph(),
  new Blockquote(),
  new Emoji(),
  new BulletList(),
  new CodeBlock( { softToDOM: true } ),
  new CodeFence(),
  new CheckboxList(),
  new CheckboxItem(),
  new Embed(),
  new ListItem(),
  new Notice({ dictionary: { ...baseDictionary } }),
  new Heading({ softToDOM: true }),
  new HorizontalRule(),
  new Image(),
  new Table(),
  new TableCell(),
  new TableHeadCell(),
  new TableRow(),
  new BlueBackground(),
  new RedBackground(),
  new OrangeBackground(),
  new YellowBackground(),
  new GreenBackground(),
  new Bold(),
  new Code(),
  new Italic(),
  new Link(),
  new Strikethrough(),
  new TemplatePlaceholder(),
  new Underline(),
  new OrderedList(),
  new OrangeHighlight(),
  new YellowHighlight(),
  new BlueHighlight(),
  new GreenHighlight(),
  new RedHighlight(),
]);

export const schema = new Schema({
  nodes: extensions.nodes,
  marks: extensions.marks,
});

const domParser = DOMParser.fromSchema(schema);
const domSerializer = DOMSerializer.fromSchema(schema);

const markdownParser = extensions.parser({
  schema,
  plugins: extensions.rulePlugins,
});

const parseHTML = (document: Document) => (html: string) => {
  const domNode = document.createElement("div");
  domNode.innerHTML = html;
  return domParser.parse(domNode);
};

const serializeToHTML = (document: Document) => (doc: ProsemirrorNode) => {
  const serializedFragment = domSerializer.serializeFragment(doc.content, {
    document,
  });
  const throwAwayDiv = document.createElement("div");
  throwAwayDiv.appendChild(serializedFragment);

  return throwAwayDiv.innerHTML;
};

export const parseMarkdown = (markdown: string) => {
  return markdownParser.parse(markdown);
};

export const mdToHtml =
  (document: Document) =>
  (markdown: string): string => {
    const doc = parseMarkdown(markdown) as ProsemirrorNode;
    return serializeToHTML(document)(doc);
  };

/**
 * @param isHTML_
 * @param document_
 */
export const externalHtmlOrMdToHtml =
  (isHTML_ = isHTML, document_ = document) =>
  (content: string) => {
    if (isHTML_(content)) {
      return serializeToHTML(document_)(parseHTML(document_)(content));
    } else {
      return mdToHtml(document_)(content);
    }
  };
