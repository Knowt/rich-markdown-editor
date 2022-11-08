"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = require("react-dom");
const styled_components_1 = __importDefault(require("styled-components"));
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const Mark_1 = __importDefault(require("./Mark"));
const constants_1 = require("../lib/constants");
const LinkPopout = styled_components_1.default.div `
  position: fixed;
  left: 50%;
  top: 50%;
`;
const LINK_INPUT_REGEX = /\[([^[]+)]\((\S+)\)$/;
class Link extends Mark_1.default {
    get name() {
        return "link";
    }
    get schema() {
        return {
            attrs: {
                href: {
                    default: "",
                },
            },
            inclusive: false,
            parseDOM: [
                {
                    tag: "a[href]",
                    getAttrs: (dom) => ({
                        href: dom.getAttribute("href"),
                    }),
                },
            ],
            toDOM: (node) => [
                "a",
                Object.assign(Object.assign({}, node.attrs), { rel: "noopener noreferrer nofollow" }),
                0,
            ],
        };
    }
    handleLinkShortcut(type, state, dispatch) {
        if (state.selection.empty) {
            this.options.onKeyboardShortcut();
            return true;
        }
        return prosemirror_commands_1.toggleMark(type, { href: "" })(state, dispatch);
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(LINK_INPUT_REGEX, (state, match, start, end) => {
                const [okay, alt, href] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start, end, this.editor.schema.text(alt)).addMark(start, start + alt.length, type.create({ href }));
                }
                return tr;
            }),
        ];
    }
    commands({ type }) {
        return ({ href } = { href: "" }) => prosemirror_commands_1.toggleMark(type, { href });
    }
    keys({ type }) {
        const linkShortcutFn = (state, dispatch) => this.handleLinkShortcut(type, state, dispatch);
        return {
            [constants_1.LINK_SHORTCUT1]: linkShortcutFn,
            [constants_1.LINK_SHORTCUT2]: linkShortcutFn,
        };
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleDOMEvents: {
                        mouseover: (_view, event) => {
                            if (event.target instanceof HTMLAnchorElement &&
                                !event.target.className.includes("ProseMirror-widget")) {
                                const editor = document.getElementById('knowt-markdown-editor');
                                if (editor) {
                                    const popout = document.createElement('div');
                                    popout.innerHTML = 'Popout';
                                    react_dom_1.createPortal("Popout", editor);
                                }
                                if (this.options.onHoverLink) {
                                    return this.options.onHoverLink(event);
                                }
                            }
                            return false;
                        },
                        mouseleave: (_, event) => {
                            console.log('leave');
                            const editor = document.getElementById('knowt-markdown-editor');
                            if (editor) {
                                const word = document.getElementsByClassName('link-popout');
                                Array.from(word).forEach((node) => {
                                    editor.removeChild(node);
                                });
                            }
                        },
                        click: (_view, event) => {
                            if (event.target instanceof HTMLAnchorElement) {
                                const href = event.target.href ||
                                    (event.target.parentNode instanceof HTMLAnchorElement
                                        ? event.target.parentNode.href
                                        : "");
                                const isHashtag = href.startsWith("#");
                                if (isHashtag && this.options.onClickHashtag) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.options.onClickHashtag(href, event);
                                    return true;
                                }
                                if (this.options.onClickLink) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    this.options.onClickLink(href, event);
                                    return true;
                                }
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    }
    get toMarkdown() {
        return {
            open(_state, mark, parent, index) {
                return "[";
            },
            close(state, mark, parent, index) {
                return ("](" +
                    state.esc(mark.attrs.href) +
                    (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") +
                    ")");
            },
        };
    }
    parseMarkdown() {
        return {
            mark: "link",
            getAttrs: (tok) => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null,
            }),
        };
    }
}
exports.default = Link;
//# sourceMappingURL=Link.js.map