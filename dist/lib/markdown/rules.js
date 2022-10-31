"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_1 = __importDefault(require("markdown-it"));
const BLOCK_RULER_DISABLED = ['code'];
function rules({ rules = {}, plugins = [], }) {
    const markdownIt = markdown_it_1.default("default", Object.assign({ breaks: false, html: false, linkify: false }, rules));
    plugins.forEach((plugin) => markdownIt.use(plugin));
    markdownIt.block.ruler.disable(BLOCK_RULER_DISABLED);
    return markdownIt;
}
exports.default = rules;
//# sourceMappingURL=rules.js.map