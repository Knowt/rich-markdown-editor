import { toggleMark } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { InputRule } from "prosemirror-inputrules";
import Mark from "./Mark";
import { LINK_SHORTCUT1, LINK_SHORTCUT2 } from '../lib/constants';

/* CONSTANTS */
const LINK_INPUT_REGEX = /\[([^[]+)]\((\S+)\)$/;
const LINK_META_KEY = 'link-popout';

export default class Link extends Mark {
  isPopoutDisplayed = false;

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
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute("href"),
          }),
        },
      ],
      toDOM: (node) => [
        "a",
        {
          ...node.attrs,
          rel: "noopener noreferrer nofollow",
        },
        0,
      ],
    };
  }

  private handleLinkShortcut( type, state, dispatch ) {
    if (state.selection.empty) {
      this.options.onKeyboardShortcut();
      return true;
    }
  
    return toggleMark(type, { href: "" })(state, dispatch);
  }

  inputRules({ type }) {
    return [
      new InputRule(LINK_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, href] = match;
        const { tr } = state;

        if (okay) {
          tr.replaceWith(start, end, this.editor.schema.text(alt)).addMark(
            start,
            start + alt.length,
            type.create({ href })
          );
        }

        return tr;
      }),
    ];
  }

  commands({ type }) {
    return ({ href } = { href: "" }) => toggleMark(type, { href });
  }

  keys({ type }) {
    const linkShortcutFn = (state, dispatch) => this.handleLinkShortcut(
      type,
      state,
      dispatch,
    );

    return {
      [ LINK_SHORTCUT1 ]: linkShortcutFn,
      [ LINK_SHORTCUT2 ]: linkShortcutFn,
    };
  }

  get plugins() {

    return [
      new Plugin({
        state: {
          init: () => {
            return DecorationSet.empty;
          },
          apply: (tr, value) => {
            const { doc, getMeta } = tr;
            const hover = getMeta( LINK_META_KEY );
            if ( !hover ) {
              return value;
            }

            const decorations: Decoration[] = [];

            doc.descendants( ( node, pos ) => {
              if ( node.type.name !== 'text' ) {
                return;
              }
      
              node.marks.forEach( ( { attrs, type } ) => {
                if ( type.name !== this.name ) {
                  return;
                }
      
                decorations.push(
                  Decoration.widget(
                    pos,
                    (view, d)=> {
                      const wrapper = document.createElement( 'div' );
                      wrapper.className = 'link-popout';
      
                      // TODO - test to see if the image is valid
                      // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
                      const img = document.createElement( 'img' );
                      img.src = `${attrs.href}/favicon.ico`;
                      img.width = 15;
                      img.height = 15;
      
                      wrapper.appendChild( img );
      
                      // TODO - strip https:// to just show base url
                      const linkText = document.createElement( 'span' );
                      linkText.className = 'link-popout-text';
                      linkText.innerText = attrs.href;
      
                      wrapper.appendChild( linkText );
      
                      const copyButton = document.createElement( 'button' );
                      copyButton.className = 'copy-link-button';
                      copyButton.type = 'button';
                      copyButton.onclick = () => {}
      
                      wrapper.appendChild( copyButton );
                      
                      if ( !this.options.readOnly ) {
                        const editButton = document.createElement( 'button' );
                        editButton.className = 'edit-link-button';
                        editButton.type = 'button';
                        editButton.onclick = () => {}
      
                        wrapper.appendChild( editButton );
                      }
      
                      return wrapper;
                    }
                  )
                )
              } );
            } );
      
            return DecorationSet.create(doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleDOMEvents: {
            mouseover: (view, event: MouseEvent) => {
              if (
                event.target instanceof HTMLAnchorElement &&
                !event.target.className.includes("ProseMirror-widget")
              ) {
                const { dispatch, state } = view;
                dispatch( state.tr.setMeta( LINK_META_KEY, {
                  event: 'mouseover',
                  rect: event.target.getBoundingClientRect(),
                } ) );

                this.isPopoutDisplayed = true;

                if (this.options.onHoverLink) {
                  return this.options.onHoverLink(event);
                }
              }
              return false;
            },
            mouseout: (view, event) => {
              const target = event.target as HTMLAreaElement;

              if ( this.isPopoutDisplayed && target?.closest("a") ) {
                const { dispatch, state } = view;
                dispatch( state.tr.setMeta( LINK_META_KEY, {
                  event: 'mouseout',
                } ) );

                this.isPopoutDisplayed = false;
              }
            },
            click: (_, event: MouseEvent) => {
              if (event.target instanceof HTMLAnchorElement) {
                const href =
                  event.target.href ||
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
        return (
          "](" +
          state.esc(mark.attrs.href) +
          (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") +
          ")"
        );
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
