"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlashcardEditorExtensions = exports.Extension = void 0;
const Bold_1 = __importDefault(require("./marks/Bold"));
const Code_1 = __importDefault(require("./marks/Code"));
const RedHighlight_1 = __importDefault(require("./marks/highlights/RedHighlight"));
const OrangeHighlight_1 = __importDefault(require("./marks/highlights/OrangeHighlight"));
const YellowHighlight_1 = __importDefault(require("./marks/highlights/YellowHighlight"));
const GreenHighlight_1 = __importDefault(require("./marks/highlights/GreenHighlight"));
const BlueHighlight_1 = __importDefault(require("./marks/highlights/BlueHighlight"));
const backgrounds_1 = require("./marks/backgrounds");
const Italic_1 = __importDefault(require("./marks/Italic"));
const Strikethrough_1 = __importDefault(require("./marks/Strikethrough"));
const Placeholder_1 = __importDefault(require("./marks/Placeholder"));
const Underline_1 = __importDefault(require("./marks/Underline"));
const Doc_1 = __importDefault(require("./nodes/Doc"));
const Text_1 = __importDefault(require("./nodes/Text"));
const BulletList_1 = __importDefault(require("./nodes/BulletList"));
const CheckboxList_1 = __importDefault(require("./nodes/CheckboxList"));
const CheckboxItem_1 = __importDefault(require("./nodes/CheckboxItem"));
const HardBreak_1 = __importDefault(require("./nodes/HardBreak"));
const ListItem_1 = __importDefault(require("./nodes/ListItem"));
const OrderedList_1 = __importDefault(require("./nodes/OrderedList"));
const Paragraph_1 = __importDefault(require("./nodes/Paragraph"));
const History_1 = __importDefault(require("./plugins/History"));
const MaxLength_1 = __importDefault(require("./plugins/MaxLength"));
const Placeholder_2 = __importDefault(require("./plugins/Placeholder"));
const SmartText_1 = __importDefault(require("./plugins/SmartText"));
const TrailingNode_1 = __importDefault(require("./plugins/TrailingNode"));
const PasteHandler_1 = __importDefault(require("./plugins/PasteHandler"));
var Extension_1 = require("./lib/Extension");
Object.defineProperty(exports, "Extension", { enumerable: true, get: function () { return __importDefault(Extension_1).default; } });
const getFlashcardEditorExtensions = (input) => {
    const { maxLength, placeholder } = input;
    return [
        new Doc_1.default(),
        new HardBreak_1.default(),
        new Paragraph_1.default(),
        new Text_1.default(),
        new OrderedList_1.default(),
        new CheckboxList_1.default(),
        new BulletList_1.default(),
        new CheckboxItem_1.default({
            includeDrag: false,
        }),
        new ListItem_1.default({
            includeDrag: false,
        }),
        new backgrounds_1.BlueBackground(),
        new backgrounds_1.RedBackground(),
        new backgrounds_1.OrangeBackground(),
        new backgrounds_1.YellowBackground(),
        new backgrounds_1.GreenBackground(),
        new Bold_1.default(),
        new Code_1.default(),
        new OrangeHighlight_1.default(),
        new YellowHighlight_1.default(),
        new BlueHighlight_1.default(),
        new GreenHighlight_1.default(),
        new RedHighlight_1.default(),
        new Italic_1.default(),
        new Placeholder_1.default(),
        new Underline_1.default(),
        new Strikethrough_1.default(),
        new History_1.default(),
        new SmartText_1.default(),
        new TrailingNode_1.default(),
        new PasteHandler_1.default(),
        new Placeholder_2.default({
            placeholder,
        }),
        new MaxLength_1.default({
            maxLength,
        }),
    ];
};
exports.getFlashcardEditorExtensions = getFlashcardEditorExtensions;
//# sourceMappingURL=client.js.map