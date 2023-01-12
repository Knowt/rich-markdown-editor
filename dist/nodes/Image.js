"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const styled_components_1 = __importDefault(require("styled-components"));
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const uploadPlaceholder_1 = __importDefault(require("../lib/uploadPlaceholder"));
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const Node_1 = __importDefault(require("./Node"));
const useResizeObserver_1 = __importDefault(require("../hooks/useResizeObserver"));
const imsize_1 = __importDefault(require("../rules/imsize"));
const IMAGE_INPUT_REGEX = /!\[(?<alt>[^\]\[]*?)]\((?<filename>[^\]\[]*?)(?=\“|\))\“?(?<layoutclass>[^\]\[\”]+)?\”?\)$/;
const resizeIcon = (React.createElement("svg", { viewBox: "0 0 512 512", style: { transform: "rotate(-90deg)" } },
    React.createElement("path", { fill: "#fff", d: "M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z" })));
const uploadPlugin = (options) => {
    return new prosemirror_state_1.Plugin({
        props: {
            handleDOMEvents: {
                paste(view, event) {
                    if ((view.props.editable && !view.props.editable(view.state)) ||
                        !options.uploadImage) {
                        return false;
                    }
                    if (!event.clipboardData)
                        return false;
                    const files = Array.prototype.slice
                        .call(event.clipboardData.items)
                        .map((dt) => dt.getAsFile())
                        .filter((file) => file);
                    if (files.length === 0)
                        return false;
                    const { tr } = view.state;
                    if (!tr.selection.empty) {
                        tr.deleteSelection();
                    }
                    const pos = tr.selection.from;
                    insertFiles_1.default(view, event, pos, files, options);
                    return true;
                },
                dragenter: (_, event) => {
                    event.preventDefault();
                },
                dragover: (_, event) => {
                    event.preventDefault();
                },
                drop(view, event) {
                    var _a;
                    if (((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.effectAllowed) === 'move') {
                        const { state, dispatch } = view;
                        const { tr } = state;
                        const result = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        });
                        if (result && tr.selection.node) {
                            tr.insert(result.pos, state.selection.node);
                            tr.deleteSelection();
                            dispatch(tr);
                            return true;
                        }
                    }
                    if ((view.props.editable && !view.props.editable(view.state)) ||
                        !options.uploadImage) {
                        return false;
                    }
                    const files = getDataTransferFiles_1.default(event).filter((file) => /image/i.test(file.type));
                    if (files.length === 0) {
                        return false;
                    }
                    const result = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    });
                    if (result) {
                        insertFiles_1.default(view, event, result.pos, files, options);
                        return true;
                    }
                    return false;
                },
            },
        },
    });
};
class Image extends Node_1.default {
    constructor() {
        super(...arguments);
        this.handleCaptionKeyDown = ({ node, getPos }) => (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos() + node.nodeSize);
                view.dispatch(view.state.tr.setSelection(new prosemirror_state_1.TextSelection($pos)).split($pos.pos));
                view.focus();
                return;
            }
            if (event.key === "Backspace" && event.target.innerText === "") {
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos());
                const tr = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
                view.dispatch(tr.deleteSelection());
                view.focus();
                return;
            }
        };
        this.handleCaptionBlur = ({ node, getPos }) => (event) => {
            const alt = event.target.innerText;
            const { src, title, width, height } = node.attrs;
            if (alt === node.attrs.alt)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                src,
                alt,
                title,
                width,
                height,
            });
            view.dispatch(transaction);
        };
        this.handleSelect = ({ getPos }) => () => {
            const { view } = this.editor;
            const $pos = view.state.doc.resolve(getPos());
            const transaction = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
            view.dispatch(transaction);
        };
        this.resizeImage = ({ node, getPos, width, height }) => {
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, Object.assign(Object.assign({}, node.attrs), { width: Math.round(width), height: Math.round(height) }));
            view.dispatch(transaction);
        };
        this.component = (props) => {
            const { isSelected, node, getPos } = props;
            const { alt, src, title, width, height } = node.attrs;
            const resizableWrapperRef = React.useRef(null);
            useResizeObserver_1.default(resizableWrapperRef, (entry) => {
                this.resizeImage({ node, getPos, width: entry.width, height: entry.height });
            }, this.options.readOnly);
            return (React.createElement("div", { contentEditable: false, className: "image", onClick: () => this.handleSelect(props)(), role: 'button' },
                React.createElement(ImageWrapper, { draggable: true, className: isSelected ? "ProseMirror-selectednode" : "", onDragStartCapture: (event) => {
                        this.handleSelect(props)();
                        event.dataTransfer.effectAllowed = 'move';
                    } },
                    React.createElement(ResizableWrapper, Object.assign({ ref: resizableWrapperRef }, { width, height }),
                        React.createElement("img", { width: width, height: height, src: src, alt: alt, title: title }),
                        React.createElement(ResizeButtonContainer, null,
                            React.createElement(ResizeIconContainer, null, resizeIcon)))),
                React.createElement(Caption, { onKeyDown: this.handleCaptionKeyDown(props), onBlur: this.handleCaptionBlur(props), className: "caption", tabIndex: -1, role: "textbox", contentEditable: true, suppressContentEditableWarning: true, "data-caption": this.options.dictionary.imageCaptionPlaceholder }, alt)));
        };
    }
    get name() {
        return "image";
    }
    get schema() {
        return {
            inline: true,
            attrs: {
                src: {},
                alt: { default: null },
                title: { default: null },
                width: { default: null },
                height: { default: null },
            },
            content: "text*",
            marks: "",
            group: "inline",
            parseDOM: [
                {
                    tag: "div[class~=image]",
                    getAttrs: (dom) => {
                        const img = dom.getElementsByTagName("img")[0];
                        return {
                            src: img === null || img === void 0 ? void 0 : img.getAttribute("src"),
                            alt: img === null || img === void 0 ? void 0 : img.getAttribute("alt"),
                            title: img === null || img === void 0 ? void 0 : img.getAttribute("title"),
                        };
                    },
                },
                {
                    tag: "img",
                    getAttrs: (dom) => {
                        return {
                            src: dom.getAttribute("src"),
                            alt: dom.getAttribute("alt"),
                            title: dom.getAttribute("title"),
                        };
                    },
                },
            ],
            toDOM: (node) => {
                return [
                    "div",
                    { class: "image" },
                    ["img", Object.assign(Object.assign({}, node.attrs), { contentEditable: false })],
                    ["p", { class: "caption" }, 0],
                ];
            },
        };
    }
    toMarkdown(state, node) {
        let markdown = " ![" +
            state.esc((node.attrs.alt || "").replace("\n", "") || "") +
            "](" +
            state.esc(node.attrs.src);
        if (node.attrs.title) {
            markdown += ' "' + state.esc(node.attrs.title) + '"';
        }
        if (node.attrs.width && node.attrs.height) {
            markdown += " =" + node.attrs.width + "x" + node.attrs.height;
        }
        markdown += ")";
        state.write(markdown);
    }
    parseMarkdown() {
        return {
            node: "image",
            getAttrs: (token) => {
                return {
                    src: token.attrGet("src"),
                    alt: (token.children[0] && token.children[0].content) || null,
                    title: token.attrGet("title"),
                    width: token.attrGet("width") || null,
                    height: token.attrGet("height") || null,
                };
            },
        };
    }
    commands({ type }) {
        return {
            deleteImage: () => (state, dispatch) => {
                dispatch(state.tr.deleteSelection());
                return true;
            },
            replaceImage: () => (state) => {
                const { view } = this.editor;
                const { uploadImage, onImageUploadStart, onImageUploadStop, onShowToast, } = this.editor.props;
                if (!uploadImage) {
                    throw new Error("uploadImage prop is required to replace images");
                }
                const inputElement = document.createElement("input");
                inputElement.type = "file";
                inputElement.accept = "image/*";
                inputElement.onchange = (event) => {
                    const files = getDataTransferFiles_1.default(event);
                    insertFiles_1.default(view, event, state.selection.from, files, {
                        uploadImage,
                        onImageUploadStart,
                        onImageUploadStop,
                        onShowToast,
                        dictionary: this.options.dictionary,
                        replaceExisting: true,
                    });
                };
                inputElement.click();
            },
            createImage: () => () => {
            },
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
                const [okay, alt, src] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start - 1, end, type.create({
                        src,
                        alt,
                    }));
                }
                return tr;
            }),
        ];
    }
    get rulePlugins() {
        return [imsize_1.default];
    }
    get plugins() {
        return [uploadPlaceholder_1.default, uploadPlugin(this.options)];
    }
}
exports.default = Image;
const ResizableWrapper = styled_components_1.default.div.attrs(({ width, height }) => ({
    style: {
        aspectRatio: `${width} / ${height}`,
        width: `${width}px`,
    },
})) `
  resize: both;
  overflow: hidden;
  position: relative;
  height: auto !important;
  max-width: 100%;

  &::-webkit-resizer {
    display: none;
  }

  @media (max-width: 600px) {
    max-width: 300px;
  }
`;
const Button = styled_components_1.default.button `
  position: absolute;
  top: 8px;
  right: 8px;
  border: 0;
  margin: 0;
  padding: 0;
  border-radius: 4px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.textSecondary};
  width: 24px;
  height: 24px;
  display: inline-block;
  cursor: pointer;
  opacity: 0;
  transition: opacity 100ms ease-in-out;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    color: ${(props) => props.theme.text};
    opacity: 1;
  }
`;
const Caption = styled_components_1.default.p `
  border: 0;
  display: block;
  font-size: 13px;
  font-style: italic;
  font-weight: normal;
  color: ${(props) => props.theme.textSecondary};
  padding: 2px 0;
  line-height: 16px;
  text-align: center;
  min-height: 1em;
  outline: none;
  background: none;
  resize: none;
  user-select: text;
  cursor: text;

  &:empty:not(:focus) {
    visibility: hidden;
  }

  &:empty:before {
    color: ${(props) => props.theme.placeholder};
    content: attr(data-caption);
    pointer-events: none;
  }
`;
const ImageWrapper = styled_components_1.default.span `
  line-height: 0;
  display: inline-block;
  position: relative;
  max-width: 100%;

  &:hover {
    ${Button} {
      opacity: 0.9;
    }
  }

  &.ProseMirror-selectednode + ${Caption} {
    visibility: visible;
  }
`;
const ResizeButtonContainer = styled_components_1.default.div `
  min-width: 22px;
  min-height: 22px;
  max-width: 22px;
  max-height: 22px;
  background-color: black;
  position: absolute;
  bottom: -5px;
  right: -5px;
  border-radius: 50%;
`;
const ResizeIconContainer = styled_components_1.default.div `
  min-width: 10px;
  min-height: 10px;
  max-width: 10px;
  max-height: 10px;
  margin-top: 5px;
  margin-left: 5px;
`;
//# sourceMappingURL=Image.js.map