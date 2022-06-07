"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_tables_1 = require("prosemirror-tables");
const prosemirror_commands_1 = require("prosemirror-commands");
const Extension_1 = __importDefault(require("../lib/Extension"));
const isUrl_1 = __importDefault(require("../lib/isUrl"));
const isMarkdown_1 = __importDefault(require("../lib/isMarkdown"));
const isInCode_1 = __importDefault(require("../queries/isInCode"));
const Prism_1 = require("./Prism");
function normalizePastedMarkdown(text) {
    const CHECKBOX_REGEX = /^\s?(\[(X|\s|_|-)\]\s(.*)?)/gim;
    while (text.match(CHECKBOX_REGEX)) {
        text = text.replace(CHECKBOX_REGEX, match => `- ${match.trim()}`);
    }
    return text;
}
class PasteHandler extends Extension_1.default {
    get name() {
        return "markdown-paste";
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handlePaste: (view, event) => {
                        if (view.props.editable && !view.props.editable(view.state)) {
                            return false;
                        }
                        if (!event.clipboardData)
                            return false;
                        const text = event.clipboardData.getData("text/plain");
                        const html = event.clipboardData.getData("text/html");
                        const vscode = event.clipboardData.getData("vscode-editor-data");
                        const { state, dispatch } = view;
                        if (isUrl_1.default(text)) {
                            if (!state.selection.empty) {
                                prosemirror_commands_1.toggleMark(this.editor.schema.marks.link, { href: text })(state, dispatch);
                                return true;
                            }
                            const { embeds } = this.editor.props;
                            if (embeds && !prosemirror_tables_1.isInTable(state)) {
                                for (const embed of embeds) {
                                    const matches = embed.matcher(text);
                                    if (matches) {
                                        this.editor.commands.embed({
                                            href: text,
                                        });
                                        return true;
                                    }
                                }
                            }
                            const transaction = view.state.tr
                                .insertText(text, state.selection.from, state.selection.to)
                                .addMark(state.selection.from, state.selection.to + text.length, state.schema.marks.link.create({ href: text }));
                            view.dispatch(transaction);
                            return true;
                        }
                        if (isInCode_1.default(view.state)) {
                            event.preventDefault();
                            view.dispatch(view.state.tr.insertText(text));
                            return true;
                        }
                        const vscodeMeta = vscode ? JSON.parse(vscode) : undefined;
                        const pasteCodeLanguage = vscodeMeta === null || vscodeMeta === void 0 ? void 0 : vscodeMeta.mode;
                        if (pasteCodeLanguage && pasteCodeLanguage !== "markdown") {
                            event.preventDefault();
                            view.dispatch(view.state.tr
                                .replaceSelectionWith(view.state.schema.nodes.code_fence.create({
                                language: Object.keys(Prism_1.LANGUAGES).includes(vscodeMeta.mode)
                                    ? vscodeMeta.mode
                                    : null,
                            }))
                                .insertText(text));
                            return true;
                        }
                        if (html === null || html === void 0 ? void 0 : html.includes("data-pm-slice")) {
                            return false;
                        }
                        if (isMarkdown_1.default(text) ||
                            html.length === 0 ||
                            pasteCodeLanguage === "markdown") {
                            event.preventDefault();
                            const paste = this.editor.pasteParser.parse(normalizePastedMarkdown(text));
                            const slice = paste.slice(0);
                            const transaction = view.state.tr.replaceSelection(slice);
                            view.dispatch(transaction);
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    }
}
exports.default = PasteHandler;
//# sourceMappingURL=PasteHandler.js.map