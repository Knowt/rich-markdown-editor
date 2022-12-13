"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlashcardEditorExtensions = exports.flashcardMdToText = exports.flashcardMdToHtml = exports.flashcardDocToHtmlString = exports.flashcardMdToHTMLDoc = exports.getFlashCardMdToHtmlInput = exports.getFlashcardSerializerExtensions = exports.cleanFlashcardSpecialChars = exports.FLASHCARD_QUIZLET_SPECIAL_CHARS = exports.normalizeFlashcardText = void 0;
const prosemirror_model_1 = require("prosemirror-model");
const ExtensionManager_1 = __importDefault(require("./lib/ExtensionManager"));
const Bold_1 = __importDefault(require("./marks/Bold"));
const RedHighlight_1 = __importDefault(require("./marks/highlights/RedHighlight"));
const OrangeHighlight_1 = __importDefault(require("./marks/highlights/OrangeHighlight"));
const YellowHighlight_1 = __importDefault(require("./marks/highlights/YellowHighlight"));
const GreenHighlight_1 = __importDefault(require("./marks/highlights/GreenHighlight"));
const BlueHighlight_1 = __importDefault(require("./marks/highlights/BlueHighlight"));
const Italic_1 = __importDefault(require("./marks/Italic"));
const Strikethrough_1 = __importDefault(require("./marks/Strikethrough"));
const Placeholder_1 = __importDefault(require("./marks/Placeholder"));
const Underline_1 = __importDefault(require("./marks/Underline"));
const Link_1 = __importDefault(require("./marks/Link"));
const HardBreak_1 = __importDefault(require("./nodes/HardBreak"));
const OrderedList_1 = __importDefault(require("./nodes/OrderedList"));
const BulletList_1 = __importDefault(require("./nodes/BulletList"));
const ListItem_1 = __importDefault(require("./nodes/ListItem"));
const Doc_1 = __importDefault(require("./nodes/Doc"));
const Text_1 = __importDefault(require("./nodes/Text"));
const Paragraph_1 = __importDefault(require("./nodes/Paragraph"));
const History_1 = __importDefault(require("./plugins/History"));
const MaxLength_1 = __importDefault(require("./plugins/MaxLength"));
const Placeholder_2 = __importDefault(require("./plugins/Placeholder"));
const SmartText_1 = __importDefault(require("./plugins/SmartText"));
const PasteHandler_1 = __importDefault(require("./plugins/PasteHandler"));
const normalizeFlashcardText = (text) => {
    let newText = '';
    for (const line of text.split('\n')) {
        const trimmedLine = line.trim();
        if (trimmedLine === "") {
            newText += "\n";
        }
        else {
            newText += exports.cleanFlashcardSpecialChars(trimmedLine);
        }
    }
    return newText;
};
exports.normalizeFlashcardText = normalizeFlashcardText;
exports.FLASHCARD_QUIZLET_SPECIAL_CHARS = [
    '[',
];
const cleanFlashcardSpecialChars = (rawText) => {
    const text = rawText.replace(/(\#+)|(\>+)/g, '\\$&')
        .replace(/(!\[)+/g, '!\\[');
    if (text.startsWith('---') || text.startsWith('___')) {
        return '\\' + text;
    }
    if (text.startsWith('***')) {
        let newText = '';
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (c === "*") {
                newText += "\\*";
            }
            else {
                newText += text.slice(i + 1);
                break;
            }
        }
        return newText;
    }
    if (exports.FLASHCARD_QUIZLET_SPECIAL_CHARS.includes(text[0])) {
        return '\\' + text;
    }
    return text;
};
exports.cleanFlashcardSpecialChars = cleanFlashcardSpecialChars;
const getFlashcardSerializerExtensions = () => {
    return new ExtensionManager_1.default([
        new Doc_1.default(),
        new Paragraph_1.default(),
        new Text_1.default(),
        new BulletList_1.default(),
        new OrderedList_1.default(),
        new ListItem_1.default({
            includeDrag: false,
        }),
        new OrangeHighlight_1.default(),
        new YellowHighlight_1.default(),
        new BlueHighlight_1.default(),
        new GreenHighlight_1.default(),
        new RedHighlight_1.default(),
        new Underline_1.default(),
        new Strikethrough_1.default(),
        new Bold_1.default(),
        new Italic_1.default(),
        new Link_1.default(),
        new HardBreak_1.default(),
    ]);
};
exports.getFlashcardSerializerExtensions = getFlashcardSerializerExtensions;
const getFlashCardMdToHtmlInput = () => {
    const extensions = exports.getFlashcardSerializerExtensions();
    const schema = new prosemirror_model_1.Schema({
        nodes: extensions.nodes,
        marks: extensions.marks,
    });
    const domSerializer = prosemirror_model_1.DOMSerializer.fromSchema(schema);
    const markdownParser = extensions.parser({
        schema,
        plugins: extensions.rulePlugins,
    });
    return {
        domSerializer,
        markdownParser,
    };
};
exports.getFlashCardMdToHtmlInput = getFlashCardMdToHtmlInput;
const flashcardMdToHTMLDoc = (input) => {
    const { markdownParser, domSerializer, markdown } = input;
    let doc;
    try {
        doc = markdownParser.parse(markdown);
    }
    catch (_a) {
        doc = markdownParser.parse(exports.normalizeFlashcardText(markdown));
    }
    return domSerializer.serializeFragment(doc.content, {
        document,
    });
};
exports.flashcardMdToHTMLDoc = flashcardMdToHTMLDoc;
const flashcardDocToHtmlString = (doc) => {
    const throwAwayDiv = document.createElement("div");
    throwAwayDiv.appendChild(doc);
    return throwAwayDiv.innerHTML;
};
exports.flashcardDocToHtmlString = flashcardDocToHtmlString;
const flashcardMdToHtml = (input) => {
    const doc = exports.flashcardMdToHTMLDoc(input);
    return exports.flashcardDocToHtmlString(doc);
};
exports.flashcardMdToHtml = flashcardMdToHtml;
const flashcardMdToText = (input) => {
    const doc = exports.flashcardMdToHTMLDoc(input);
    let text = '';
    const traverseNodes = (nodes) => {
        Array.from(nodes).forEach((node) => {
            if (node.childNodes.length) {
                traverseNodes(node.childNodes);
            }
            else {
                text += node.textContent;
            }
        });
        text += ' ';
    };
    traverseNodes(doc.childNodes);
    return text.trim();
};
exports.flashcardMdToText = flashcardMdToText;
const getFlashcardEditorExtensions = (input = {}) => {
    const { maxLength, disableCodePaste = true, disableLinkPaste = true } = input;
    return {
        baseExtensions: [
            new Doc_1.default(),
            new Paragraph_1.default(),
            new Text_1.default(),
            new BulletList_1.default(),
            new OrderedList_1.default(),
            new ListItem_1.default({
                includeDrag: false,
            }),
            new OrangeHighlight_1.default(),
            new YellowHighlight_1.default(),
            new BlueHighlight_1.default(),
            new GreenHighlight_1.default(),
            new RedHighlight_1.default(),
            new Underline_1.default(),
            new Strikethrough_1.default(),
            new Bold_1.default(),
            new Italic_1.default(),
            new Placeholder_1.default(),
            new History_1.default(),
            new SmartText_1.default(),
            new PasteHandler_1.default({
                disableCodePaste,
                disableLinkPaste,
            }),
            new HardBreak_1.default(),
            new MaxLength_1.default({
                maxLength,
            }),
        ],
        getPlaceholderExtension: (placeholder) => (new Placeholder_2.default({
            placeholder,
        })),
    };
};
exports.getFlashcardEditorExtensions = getFlashcardEditorExtensions;
//# sourceMappingURL=client.js.map