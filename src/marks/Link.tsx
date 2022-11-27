import React from 'react';
import { render } from 'react-dom';
import { toggleMark } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import { InputRule } from "prosemirror-inputrules";
import Mark from "./Mark";
import { LINK_SHORTCUT1, LINK_SHORTCUT2 } from '../lib/constants';
import { findParentNodeClosestToPos, setTextSelection } from '@knowt/prosemirror-utils';
import { CopyIcon, EditIcon, GlobeIcon } from 'outline-icons';
import copy from "copy-to-clipboard";
import { ToastType } from "../types";

type LinkMouseoutMeta = {
  event: 'mouseout';
}

type LinkMouseoverMeta = {
  event: 'mouseover';
  pos: number;
}

type LinkPopoutMeta = LinkMouseoutMeta | LinkMouseoverMeta;

const LINK_INPUT_REGEX = /\[([^[]+)]\((\S+)\)$/;
const LINK_META_KEY = 'link-popout';
const OTHER_ANCHOR_CLASSNAMES = [
  'grip-column',
  'grip-row',
  'grip-table',
];

export default class Link extends Mark {
  isPopoutDisplayed = false;
  mountTimeoutId: number | undefined = undefined;
  removeTimeoutId: number | undefined = undefined;

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

  private handleLinkShortcut(type, state, dispatch) {
    if (state.selection.empty) {
      this.options.onKeyboardShortcut();
      return true;
    }
  
    return toggleMark(type, { href: "" })(state, dispatch);
  }

  private resetTimeout(timeout: number | undefined) {
    if ( timeout ) {
      clearTimeout( timeout );
      timeout = undefined;
    }
  }

  private unmount(view: EditorView) {
    const linkPopout = document.getElementById( 'link-popout' );

    if ( linkPopout ) {
      linkPopout.classList.add( 'not-active' );
  
      this.removeTimeoutId = setTimeout( () => {
        this.resetTimeout( this.mountTimeoutId );

        const { dispatch, state } = view;
        dispatch( state.tr.setMeta( LINK_META_KEY, {
          event: 'mouseout',
        } ) );

        this.isPopoutDisplayed = false;
      }, 190 );
    }
  }

  private getUrlDetails(url: string) {
    const urlInterface = new URL(url);
    const { protocol, host, pathname } = urlInterface;

    return {
      baseUrl: protocol + '//' + host,
      hostname: ( host.startsWith('www.') ? host.substring(4) : host ) + pathname,
    }
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
          apply: (tr, value, newState) => {
            this.mountTimeoutId = undefined;

            const hover = tr.getMeta( LINK_META_KEY ) as LinkPopoutMeta | undefined;

            if ( !hover ) {
              return value;
            }

            value = value.map( tr.mapping, tr.doc );
            const { event } = hover;

            if ( event === 'mouseover' ) {
              const { pos } = hover;

              const result = findParentNodeClosestToPos(
                newState.doc.resolve(pos),
                (node) => node.type.name === 'paragraph' || node.type.name === 'heading',
              );

              if ( !result ) {
                return value;
              }

              // @ts-ignore
              const marks = result.node.content?.content[0]?.marks || [] as any[];

              for ( const { attrs, type } of marks ) {
                if ( type.name !== this.name ) {
                  continue;
                }

                return value.add( tr.doc, [
                  Decoration.widget(
                    pos,
                    (view) => {
                      return this.createLinkPopout( view, attrs );
                    },
                    { linkHover: true },
                  )
                ] );
              }
            }
            // mouseout
            else {
              this.removeTimeoutId = undefined;

              return value.remove(
                value.find(
                  undefined,
                  undefined,
                  ( spec ) => spec.linkHover,
                 )
              );
            }
            
            return value;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleDOMEvents: {
            mouseover: (view, event: MouseEvent) => {
              const target = event.target as HTMLAreaElement;
              
              if (
                target instanceof HTMLAnchorElement &&
                this.isLinkMark( target.className )
              ) {
                this.resetTimeout( this.removeTimeoutId );

                if ( !this.isPopoutDisplayed ) {
                  const pos = view.posAtDOM( target, 0 );
  
                  if (!pos) {
                    return false;
                  }
               
                  this.mountTimeoutId = setTimeout( () => {
                    this.resetTimeout( this.removeTimeoutId );
  
                    const { dispatch, state } = view;
                    dispatch( state.tr.setMeta( LINK_META_KEY, {
                      event: 'mouseover',
                      pos,
                    } ) );
                    
                    this.isPopoutDisplayed = true;
                  }, this.options.readOnly ? 500 : 0 );
                }
              }
              else if (
                !target.id.startsWith( 'link-popout' ) &&
                typeof target.className === 'string'
              ) {
                this.resetTimeout( this.mountTimeoutId );

                if ( this.isPopoutDisplayed ) {
                  this.unmount( view );
                }
              }

              if (this.options.onHoverLink) {
                return this.options.onHoverLink(event);
              }

              return false;
            },
            mouseleave: (view) => {
              this.resetTimeout( this.mountTimeoutId );

              if ( this.isPopoutDisplayed ) {
                this.unmount( view );
              }

              return false;
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

  isLinkMark( className: string ) {
    return OTHER_ANCHOR_CLASSNAMES.some( 
      ( otherAnchorClassName ) => !className.includes( otherAnchorClassName )
    );
  }

  createLinkPopout( view: EditorView, attrs: any ) {
    const wrapper = document.createElement( 'div' );
    wrapper.id = 'link-popout';

    if ( !this.options.readOnly ) {
      const editButton = document.createElement( 'button' );
      editButton.id = 'link-popout-edit-link-button';
      editButton.className = 'link-popout-button';
      editButton.type = 'button';
      editButton.title = 'Edit Link';
      // NOT WORKING
      editButton.onclick = (event) => {
        const elem = event.target;

        if ( elem ) {
          const { top, left } = elem.getBoundingClientRect();

          const result = view.posAtCoords({ top, left });

          if ( result ) {
            const { dispatch, state } = view;

            dispatch(
              setTextSelection(result.pos)(state.tr)
            );
          }
        }
      }

      render( 
        <EditIcon
          className='link-popout-icon'
          color={this.options.theme?.toolbarItem}
          size={15} />, 
        editButton,
      );

      wrapper.appendChild( editButton );
    }

    const copyButton = document.createElement( 'button' );
    copyButton.id = 'link-popout-copy-button';
    copyButton.className = 'link-popout-button'
    copyButton.type = 'button';
    copyButton.title = 'Copy Link';
    copyButton.onclick = () => {
      copy(attrs.href);

      if ( this.options.onShowToast ) {
        this.options.onShowToast(
          this.options.dictionary.linkCopied,
          ToastType.Info
        );
      }
    }

    render( 
      <CopyIcon
        className='link-popout-icon'
        color={this.options.theme?.toolbarItem}
        size={15} />, 
      copyButton,
    );

    wrapper.appendChild( copyButton );

    const { baseUrl, hostname } = this.getUrlDetails( attrs.href );

    const linkText = document.createElement( 'span' );
    linkText.id = 'link-popout-text';
    linkText.innerText = hostname;

    wrapper.appendChild( linkText );

    // TODO - test to see if the image is valid
    // https://stackoverflow.com/questions/55880196/is-there-a-way-to-easily-check-if-the-image-url-is-valid-or-not
    const img = document.createElement( 'img' );
    img.id ='link-popout-favicon-img';
    img.src = `${baseUrl}/favicon.ico`;
    img.width = 12;
    img.height = 12;

    wrapper.appendChild( img );

    return wrapper;
  }
}