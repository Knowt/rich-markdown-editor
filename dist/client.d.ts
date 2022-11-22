import ExtensionManager from "./lib/ExtensionManager";
import Bold from "./marks/Bold";
import Code from "./marks/Code";
import RedHighlight from "./marks/highlights/RedHighlight";
import OrangeHighlight from "./marks/highlights/OrangeHighlight";
import YellowHighlight from "./marks/highlights/YellowHighlight";
import GreenHighlight from "./marks/highlights/GreenHighlight";
import BlueHighlight from "./marks/highlights/BlueHighlight";
import { BlueBackground, RedBackground, OrangeBackground, YellowBackground, GreenBackground } from './marks/backgrounds';
import Italic from "./marks/Italic";
import Strikethrough from "./marks/Strikethrough";
import TemplatePlaceholder from "./marks/Placeholder";
import Underline from "./marks/Underline";
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import BulletList from "./nodes/BulletList";
import ListItem from "./nodes/ListItem";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";
export { default as Extension } from "./lib/Extension";
export declare const getFlashcardSerializerExtensions: () => (Doc | Text | BulletList | ListItem | OrderedList | Paragraph | Bold | Code | RedHighlight | OrangeHighlight | YellowHighlight | GreenHighlight | BlueHighlight | BlueBackground | RedBackground | OrangeBackground | YellowBackground | GreenBackground | Italic | Strikethrough | Underline)[];
declare type FlashcardMdToHtmlInput = {
    extensions: ExtensionManager;
    markdown: string;
};
export declare const flashcardMdToHtml: (input: FlashcardMdToHtmlInput) => string;
declare type GetFlashcardEditorExtensionsInput = {
    maxLength?: number;
};
export declare const getFlashcardEditorExtensions: (input: GetFlashcardEditorExtensionsInput) => {
    baseExtensions: (Doc | Text | BulletList | ListItem | OrderedList | Paragraph | Bold | Code | RedHighlight | OrangeHighlight | YellowHighlight | GreenHighlight | BlueHighlight | BlueBackground | RedBackground | OrangeBackground | YellowBackground | GreenBackground | Italic | Strikethrough | TemplatePlaceholder | Underline | History | MaxLength | SmartText | PasteHandler)[];
    getPlaceholderExtension: (placeholder: string) => Placeholder;
};
//# sourceMappingURL=client.d.ts.map