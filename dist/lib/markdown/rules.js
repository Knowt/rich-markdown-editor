"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const BLOCK_RULER_DISABLED = ['code'];
const FLASHCARD_BLOCK_RULER_DISABLED = ['code', 'list', 'heading', 'lheading', 'table', 'fence', 'blockquote', 'hr'];
const FLASHCARD_CORE_RULER_DISABLED = ['tables-pm', 'embeds', 'checkboxes', 'linkify', 'emoji', 'smartquotes'];
const FLASHCARD_INLINE_RULER_DISABLED = ['autolink', 'image', 'link'];
function rules({ rules = {}, plugins = [], isFlashcardEditor = true, }) {
    const markdownIt = markdown_it_1.default("default", Object.assign({ breaks: false, html: false, linkify: false }, rules));
    plugins.forEach((plugin) => markdownIt.use(plugin));
    if (isFlashcardEditor) {
        markdownIt.block.ruler.disable(FLASHCARD_BLOCK_RULER_DISABLED);
        markdownIt.core.ruler.disable(FLASHCARD_CORE_RULER_DISABLED);
        markdownIt.inline.ruler.disable(FLASHCARD_INLINE_RULER_DISABLED);
    }
    else {
        markdownIt.block.ruler.disable(BLOCK_RULER_DISABLED);
    }
    return markdownIt;
}
exports.default = rules;
//# sourceMappingURL=rules.js.map