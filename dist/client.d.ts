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
import CheckboxList from "./nodes/CheckboxList";
import CheckboxItem from "./nodes/CheckboxItem";
import HardBreak from "./nodes/HardBreak";
import ListItem from "./nodes/ListItem";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import PasteHandler from "./plugins/PasteHandler";
export { default as Extension } from "./lib/Extension";
declare type Input = {
    maxLength?: number;
};
export declare const getFlashcardEditorExtensions: (input: Input) => {
    baseExtensions: (Doc | Text | BulletList | CheckboxList | CheckboxItem | HardBreak | ListItem | OrderedList | Paragraph | Code | RedHighlight | OrangeHighlight | YellowHighlight | GreenHighlight | BlueHighlight | BlueBackground | RedBackground | OrangeBackground | YellowBackground | GreenBackground | Italic | Strikethrough | TemplatePlaceholder | Underline | History | MaxLength | SmartText | PasteHandler | Bold)[];
    getPlaceholderExtension: (placeholder: string) => Placeholder;
};
//# sourceMappingURL=client.d.ts.map