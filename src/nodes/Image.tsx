import * as React from "react";
import { Plugin, TextSelection, NodeSelection } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import styled from "styled-components";
import getDataTransferFiles from "../lib/getDataTransferFiles";
import uploadPlaceholderPlugin from "../lib/uploadPlaceholder";
import insertFiles from "../commands/insertFiles";
import Node from "./Node";
import useResizeObserver from "../hooks/useResizeObserver";
import imsizeRule from "../rules/imsize";

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, class]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "class") -> [, "", "image.jpg", "small"]
 * ![Lorem](image.jpg "class") -> [, "Lorem", "image.jpg", "small"]
 */
// TODO: alter the regex to detect image size as well: `![Lorem](image.jpg =100x100)`
const IMAGE_INPUT_REGEX =
  /!\[(?<alt>[^\]\[]*?)]\((?<filename>[^\]\[]*?)(?=\“|\))\“?(?<layoutclass>[^\]\[\”]+)?\”?\)$/;

const resizeIcon = (
  <svg viewBox="0 0 512 512" style={{ transform: "rotate(-90deg)" }}>
    <path
      fill="#fff"
      d="M208 281.4c-12.5-12.5-32.76-12.5-45.26-.002l-78.06 78.07l-30.06-30.06c-6.125-6.125-14.31-9.367-22.63-9.367c-4.125 0-8.279 .7891-12.25 2.43c-11.97 4.953-19.75 16.62-19.75 29.56v135.1C.0013 501.3 10.75 512 24 512h136c12.94 0 24.63-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.938-34.87l-30.06-30.06l78.06-78.07c12.5-12.49 12.5-32.75 .002-45.25L208 281.4zM487.1 0h-136c-12.94 0-24.63 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.938 34.87l30.06 30.06l-78.06 78.07c-12.5 12.5-12.5 32.76 0 45.26l22.62 22.62c12.5 12.5 32.76 12.5 45.26 0l78.06-78.07l30.06 30.06c9.156 9.141 22.87 11.84 34.87 6.937C504.2 184.6 512 172.9 512 159.1V23.1C512 10.74 501.3 0 487.1 0z"
    />
  </svg>
);

const uploadPlugin = (options) => {
  return new Plugin({
    props: {
      handleDOMEvents: {
        paste(view, event: ClipboardEvent): boolean {
          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          if (!event.clipboardData) return false;

          // check if we actually pasted any files
          const files = Array.prototype.slice
            .call(event.clipboardData.items)
            .map((dt) => dt.getAsFile())
            .filter((file) => file);

          if (files.length === 0) return false;

          const { tr } = view.state;
          if (!tr.selection.empty) {
            tr.deleteSelection();
          }
          const pos = tr.selection.from;

          insertFiles(view, event, pos, files, options);
          return true;
        },
        dragenter: ( _, event ) => {
          event.preventDefault();
        },
        dragover: ( _, event ) => {
          event.preventDefault();
        },
        drop(view, event: DragEvent): boolean {
          // an image is being moved to another location within the note
          if ( event.dataTransfer?.effectAllowed === 'move' ) {
            const { state, dispatch } = view;
            const { tr } = state;

            const result = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            // @ts-ignore
            if ( result && tr.selection.node ) {
                // @ts-ignore
                tr.insert( result.pos, state.selection.node );
                tr.deleteSelection();

                dispatch( tr );
  
                return true;
            }
          }

          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          // filter to only include image files
          const files = getDataTransferFiles(event).filter((file) =>
            /image/i.test(file.type)
          );

          if (files.length === 0) {
            return false;
          }

          // grab the position in the document for the cursor
          const result = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (result) {
            insertFiles(view, event, result.pos, files, options);
            return true;
          }

          return false;
        },
      },
    },
  });
};

export default class Image extends Node {
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
          getAttrs: (dom: HTMLDivElement) => {
            const img = dom.getElementsByTagName("img")[0];
            return {
              src: img?.getAttribute("src"),
              alt: img?.getAttribute("alt"),
              title: img?.getAttribute("title"),
            };
          },
        },
        {
          tag: "img",
          getAttrs: (dom: HTMLImageElement) => {
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
          ["img", { ...node.attrs, contentEditable: false }],
          ["p", { class: "caption" }, 0],
        ];
      },
    };
  }

  handleCaptionKeyDown =
    ({ node, getPos }) =>
    (event) => {
      // Pressing Enter inside the caption field should move the cursor/selection
      // below the image
      if (event.key === "Enter") {
        event.preventDefault();

        const { view } = this.editor;
        const $pos = view.state.doc.resolve(getPos() + node.nodeSize);
        view.dispatch(
          view.state.tr.setSelection(new TextSelection($pos)).split($pos.pos)
        );
        view.focus();
        return;
      }

      // Pressing Backspace in an empty caption field should remove the entire
      // image, leaving an empty paragraph
      if (event.key === "Backspace" && event.target.innerText === "") {
        const { view } = this.editor;
        const $pos = view.state.doc.resolve(getPos());
        const tr = view.state.tr.setSelection(new NodeSelection($pos));
        view.dispatch(tr.deleteSelection());
        view.focus();
        return;
      }
    };

  handleCaptionBlur =
    ({ node, getPos }) =>
    (event) => {
      const alt = event.target.innerText;
      const { src, title, width, height } = node.attrs;

      if (alt === node.attrs.alt) return;

      const { view } = this.editor;
      const { tr } = view.state;

      // update meta on object
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

  handleSelect =
    ({ getPos }) =>
    () => {
      const { view } = this.editor;
      const $pos = view.state.doc.resolve(getPos());
      const transaction = view.state.tr.setSelection(new NodeSelection($pos));
      view.dispatch(transaction);
    };

  resizeImage = ({ node, getPos, width, height }) => {
    const { view } = this.editor;
    const { tr } = view.state;

    const pos = getPos();
    const transaction = tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      width: Math.round(width),
      height: Math.round(height),
    });
    view.dispatch(transaction);
  };

  component = (props) => {
    const { isSelected, node, getPos } = props;
    const { alt, src, title, width, height } = node.attrs;

    const resizableWrapperRef = React.useRef(null);

    useResizeObserver(resizableWrapperRef, (entry) => {
      this.resizeImage({ node, getPos, width: entry.width, height: entry.height });
    });

    return (
      <div contentEditable={false} className="image"
        onClick={() => this.handleSelect(props)()} role='button'>
        <ImageWrapper draggable={true}
          className={isSelected ? "ProseMirror-selectednode" : ""}
          onDragStartCapture={( event ) => {
            this.handleSelect(props)();

            event.dataTransfer.effectAllowed = 'move';
          }}>
          <ResizableWrapper ref={resizableWrapperRef} 
            {...{ width, height }}
          >
            <img width={width} height={height}
              src={src} alt={alt} title={title} />
            <ResizeButtonContainer>
              <ResizeIconContainer>{resizeIcon}</ResizeIconContainer>
            </ResizeButtonContainer>
          </ResizableWrapper>
        </ImageWrapper>
        <Caption
          onKeyDown={this.handleCaptionKeyDown(props)}
          onBlur={this.handleCaptionBlur(props)}
          className="caption"
          tabIndex={-1}
          role="textbox"
          contentEditable
          suppressContentEditableWarning
          data-caption={this.options.dictionary.imageCaptionPlaceholder}
        >
          {alt}
        </Caption>
      </div>
    );
  };

  toMarkdown(state, node) {
    let markdown =
      " ![" +
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
        const {
          uploadImage,
          onImageUploadStart,
          onImageUploadStop,
          onShowToast,
        } = this.editor.props;

        if (!uploadImage) {
          throw new Error("uploadImage prop is required to replace images");
        }

        // create an input element and click to trigger picker
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = "image/*";
        inputElement.onchange = (event: Event) => {
          const files = getDataTransferFiles(event);
          insertFiles(view, event, state.selection.from, files, {
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
        // dummy function -- check how we do `/` commands filtering
        // TODO: to be removed
      },
    };
  }

  inputRules({ type }) {
    return [
      new InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, src] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(
            start - 1,
            end,
            type.create({
              src,
              alt,
            })
          );
        }

        return tr;
      }),
    ];
  }

  get rulePlugins() {
    return [imsizeRule];
  }

  get plugins() {
    return [uploadPlaceholderPlugin, uploadPlugin(this.options)];
  }
}

const ResizableWrapper = styled.div.attrs<{ width: number, height: number }>(
  ( { width, height }) => ( {
    style: {
      aspectRatio: `${width} / ${height}`,
      width: `${width}px`,
    },
  } )
)`
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

const Button = styled.button`
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

const Caption = styled.p`
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

const ImageWrapper = styled.span`
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

const ResizeButtonContainer = styled.div`
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

const ResizeIconContainer = styled.div`
  min-width: 10px;
  min-height: 10px;
  max-width: 10px;
  max-height: 10px;
  margin-top: 5px;
  margin-left: 5px;
`;
