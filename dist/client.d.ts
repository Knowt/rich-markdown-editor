import { DOMSerializer } from 'prosemirror-model';
import { MarkdownParser } from 'prosemirror-markdown';
import ExtensionManager from "./lib/ExtensionManager";
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
import HardBreak from "./nodes/HardBreak";
import OrderedList from "./nodes/OrderedList";
import BulletList from "./nodes/BulletList";
import ListItem from "./nodes/ListItem";
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Paragraph from "./nodes/Paragraph";
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";
export declare const normalizeFlashcardText: (text: string) => string;
export declare const FLASHCARD_QUIZLET_SPECIAL_CHARS: string[];
export declare const cleanFlashcardSpecialChars: (rawText: string) => string;
export declare const getFlashcardSerializerExtensions: () => ExtensionManager;
export declare const getFlashCardMdToHtmlInput: () => {
    domSerializer: DOMSerializer;
    markdownParser: MarkdownParser;
};
declare type FlashcardMdToHtmlInput = {
    domSerializer: DOMSerializer;
    markdownParser: MarkdownParser;
    markdown: string;
    document?: Document;
};
export declare const flashcardMdToHTMLDoc: (input: FlashcardMdToHtmlInput) => HTMLElement | DocumentFragment;
export declare const flashcardDocToHtmlString: (doc: HTMLElement | DocumentFragment, serverDocument?: Document | undefined) => string;
export declare const flashcardMdToHtml: (input: FlashcardMdToHtmlInput) => string;
export declare const flashcardMdToText: (input: FlashcardMdToHtmlInput) => string;
declare type GetFlashcardEditorExtensionsInput = {
    maxLength?: number;
};
export declare const getFlashcardEditorExtensions: (input?: GetFlashcardEditorExtensionsInput) => {
    baseExtensions: (Doc | Text | BulletList | HardBreak | ListItem | OrderedList | Paragraph | Bold | RedHighlight | OrangeHighlight | YellowHighlight | GreenHighlight | BlueHighlight | Italic | Strikethrough | TemplatePlaceholder | Underline | History | MaxLength | SmartText)[];
    getPlaceholderExtension: (placeholder: string) => Placeholder;
};
export declare const getFlashcardPasteHandlerExtension: () => PasteHandler;
export {};
//# sourceMappingURL=client.d.ts.map