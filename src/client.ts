import baseDictionary from "./dictionary";
import type { ToastType } from './types';
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
import Blockquote from "./nodes/Blockquote";
import BulletList from "./nodes/BulletList";
import CheckboxList from "./nodes/CheckboxList";
import Emoji from "./nodes/Emoji";
import CheckboxItem from "./nodes/CheckboxItem";
import HardBreak from "./nodes/HardBreak";
import Heading from "./nodes/Heading";
import ListItem from "./nodes/ListItem";
import OrderedList from "./nodes/OrderedList";
import Paragraph from "./nodes/Paragraph";
// plugins
import History from "./plugins/History";
import MaxLength from "./plugins/MaxLength";
import Placeholder from "./plugins/Placeholder";
import SmartText from "./plugins/SmartText";
import TrailingNode from "./plugins/TrailingNode";
import PasteHandler from "./plugins/PasteHandler";
export { default as Extension } from "./lib/Extension";

type Input = {
    dictionary?: Partial<typeof baseDictionary>;
    headingOffset?: number;
    maxLength?: number;
    placeholder?: string;
    onShowToast?: (message: string, code: ToastType) => void;
}

export const getFlashcardEditorExtensions = (
    input: Input,
) => {
    const { dictionary={},
        headingOffset,
        maxLength,
        placeholder,
        onShowToast } = input;

    const actualDictionary = {
        ...dictionary,
        ...baseDictionary,
    };

    return [
        new Doc(),
        new HardBreak(),
        new Paragraph(),
        new Blockquote(),
        new Emoji(),
        new Text(),
        new OrderedList(),
        new CheckboxList(),
        new CheckboxItem(),
        new BulletList(),
        new ListItem(),
        new Heading({
          dictionary: actualDictionary,
          onShowToast: onShowToast,
          offset: headingOffset,
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
        new TrailingNode(),
        new PasteHandler(),
        new Placeholder({
          placeholder,
        }),
        new MaxLength({
          maxLength,
        }),
    ];
}