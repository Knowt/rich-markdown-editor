import ExtensionManager from "./lib/ExtensionManager";
import Bold from "./marks/Bold";
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
import HardBreak from "./nodes/HardBreak";
import Doc from "./nodes/Doc";
import Text from "./nodes/Text";
import Paragraph from "./nodes/Paragraph";
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";
export declare const getFlashcardSerializerExtensions: () => ExtensionManager;
declare type FlashcardMdToHtmlInput = {
    extensions: ExtensionManager;
    markdown: string;
};
export declare const flashcardMdToHtml: (input: FlashcardMdToHtmlInput) => string;
declare type GetFlashcardEditorExtensionsInput = {
    maxLength?: number;
    disableLinkPaste?: boolean;
    disableCodePaste?: boolean;
};
export declare const getFlashcardEditorExtensions: (input?: GetFlashcardEditorExtensionsInput) => {
    baseExtensions: (Doc | Text | HardBreak | Paragraph | Bold | RedHighlight | OrangeHighlight | YellowHighlight | GreenHighlight | BlueHighlight | BlueBackground | RedBackground | OrangeBackground | YellowBackground | GreenBackground | Italic | Strikethrough | TemplatePlaceholder | Underline | History | MaxLength | SmartText | PasteHandler)[];
    getPlaceholderExtension: (placeholder: string) => Placeholder;
};
export {};
//# sourceMappingURL=client.d.ts.map