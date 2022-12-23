import { Schema, Node as ProsemirrorNode, DOMSerializer } from 'prosemirror-model';
import { MarkdownParser } from 'prosemirror-markdown';
import ExtensionManager from "./lib/ExtensionManager";
// marks
import Bold from "./marks/Bold";
import RedHighlight from "./marks/highlights/RedHighlight";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import Italic from "./marks/Italic";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
import Link from "./marks/Link";
import HardBreak from "./nodes/HardBreak";
import OrderedList from "./nodes/OrderedList";
import BulletList from "./nodes/BulletList";
import ListItem from "./nodes/ListItem";
// nodes
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Paragraph from "./nodes/Paragraph";
// plugins
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";

export const normalizeFlashcardText = (text: string) => {
  let newText = '';

  for (const line of text.split('\n')) {
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
        newText += '\n';
    }
    else {
        newText += cleanFlashcardSpecialChars(trimmedLine) + '\n';
    }
  }

  return newText;
}

// Because we disable certain markdown nodes within our editor,
// we need to make sure those special characters are escaped prior to import.
export const FLASHCARD_QUIZLET_SPECIAL_CHARS = [
  '[',
];

export const cleanFlashcardSpecialChars = (rawText: string) => {
  // insert a backslash where each occurence of these special characters occur
  const text = rawText.replace(/(\#+)|(\>+)|(`)|(~{3,})|(\_{3,})|(\*{3,})|(\-{3,})|(\=+)|(\-\s\-)+/g, '\\$&')
              // same concept for things that look like an image
              .replace(/(!\[)+/g, '!\\[');

  if ( FLASHCARD_QUIZLET_SPECIAL_CHARS.includes(text[0]) ) {
    return '\\' + text;
  }
  // edge cases
  if ( text === '-' ) {
    return '\\'  + text;
  }

  return text;
}

export const getFlashcardSerializerExtensions = () => {
  return new ExtensionManager([
    new Doc(),
    new Paragraph(),
    new Text(),
    new BulletList(),
    new OrderedList(),
    new ListItem({
      includeDrag: false,
    }),
    new OrangeHighlight(),
    new YellowHighlight(),
    new BlueHighlight(),
    new GreenHighlight(),
    new RedHighlight(),
    new Underline(),
    new Strikethrough(),
    new Bold(),
    new Italic(),
    new Link(),
    new HardBreak(),
  ]);
}

export const getFlashCardMdToHtmlInput = () => {
  const extensions = getFlashcardSerializerExtensions();

  const schema = new Schema({
    nodes: extensions.nodes,
    marks: extensions.marks,
  });
  const domSerializer = DOMSerializer.fromSchema(schema);
  const markdownParser = extensions.parser({
    schema,
    plugins: extensions.rulePlugins,
  });

  return {
    domSerializer,
    markdownParser,
  }
}

type FlashcardMdToHtmlInput = {
  domSerializer: DOMSerializer;
  markdownParser: MarkdownParser;
  markdown: string;
  document?: Document;
}

export const flashcardMdToHTMLDoc = (input: FlashcardMdToHtmlInput) => {
  const { markdownParser, 
    domSerializer,
    markdown,
    document: serverDocument } = input;

  let doc: ProsemirrorNode;
  try {
    doc = markdownParser.parse(markdown) as ProsemirrorNode;
  }
  catch {
    doc = markdownParser.parse(normalizeFlashcardText(markdown)) as ProsemirrorNode;
  }

  return domSerializer.serializeFragment(doc.content, {
    document: serverDocument || document
  });
}

export const flashcardDocToHtmlString = (
  doc: HTMLElement | DocumentFragment, 
  serverDocument?: Document,
) => {
  const throwAwayDiv = (serverDocument || document).createElement("div");
  throwAwayDiv.appendChild(doc);

  return throwAwayDiv.innerHTML;
}

export const flashcardMdToHtml = (
  input: FlashcardMdToHtmlInput,
) => {
  const doc = flashcardMdToHTMLDoc(input);
  return flashcardDocToHtmlString(doc, input.document);
}

// new lines are treated as spaces
export const flashcardMdToText = (input: FlashcardMdToHtmlInput) => {
  const doc = flashcardMdToHTMLDoc(input);

  let text = '';
  const traverseNodes = (nodes: NodeListOf<ChildNode>) => {
    Array.from(nodes).forEach( ( node ) => {
      if (node.childNodes.length) {
        traverseNodes(node.childNodes);
      }
      else {
        text += node.textContent;
      }
    } );
    
    text += ' ';
  }

  traverseNodes(doc.childNodes);

  return text.trim();
}

type GetFlashcardEditorExtensionsInput = {
  maxLength?: number;
}

export const getFlashcardEditorExtensions = (
  input: GetFlashcardEditorExtensionsInput={},
) => {
  const { maxLength } = input;

  return {
      baseExtensions: [
        new Doc(),
        new Paragraph(),
        new Text(),
        new BulletList(),
        new OrderedList(),
        new ListItem({
          includeDrag: false,
        }),
        new OrangeHighlight(),
        new YellowHighlight(),
        new BlueHighlight(),
        new GreenHighlight(),
        new RedHighlight(), // the order matters here!! since it's the default marker
        new Underline(),
        new Strikethrough(),
        new Bold(),
        new Italic(),
        new TemplatePlaceholder(),
        new History(),
        new SmartText(),
        new HardBreak(),
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

export const getFlashcardPasteHandlerExtension = () => {
  return new PasteHandler({
    disableCodePaste: true,
    disableLinkPaste: true,
  });
}