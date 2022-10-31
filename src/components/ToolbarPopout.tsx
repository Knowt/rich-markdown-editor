import React, { forwardRef, RefObject, useRef, 
    useEffect, MouseEvent, useState } from 'react';
import styled from 'styled-components';
import type { MenuItem as Item } from '../types';
import { defaultMarkClick } from '../commands/defaultMarkClick';
import { Portal } from "react-portal";
import theme from "../styles/theme";

const List = styled.ul`
    display: flex;
    flex-direction: column;
    position: absolute;
    font-size: 90%;
    list-style-type: none;
    background: ${props => props.theme.toolbarBackground};
    z-index: 1000;
    border-radius: 4px;
    padding: 0;
    box-shadow: 0px 0px 0.3px ${props => props.theme.toolbarShadow},
                0px 0px 0.9px ${props => props.theme.toolbarShadow},
                0px 0px 1.8px ${props => props.theme.toolbarShadow},
                0px 0px 3.7px ${props => props.theme.toolbarShadow},
                0px 0px 10px ${props => props.theme.toolbarShadow};

    transform: scale( 1 );
    transition: opacity 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                visibility 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &.not-active {
        opacity: 0;
        visibility: hidden;
        transform: translate( 4px ) 
                    scale(0.95);
    }

    /* POSITION */
    &.left {
        transform-origin: right;
    }

    &.right {
        transform-origin: left;
    }
`;

const Title = styled.span`
    margin-left: 5px;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    border: none;
    background: none;
    cursor: pointer;
    padding-block: 7px;
    color: ${(props) => props.theme.text};

    &:first-of-type {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
    }

    &:last-of-type {
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    transition: background-color 85ms ease-in-out;

    &:hover,
    &:focus {
        outline: none;
        background: ${(props) => props.theme.toolbarHoverBackground};
    }

    .toolbar-icon {
        &.light {
            filter: saturate( 300% ) brightness( 93% );
        }
    }
`;

/* TYPES */
interface Styles {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}

type Position = 'left' | 'right';

interface Props {
    id: string;
    position: Position;
    items: Item[];
    close: () => void;
    isActive: boolean;
    commands: Record<string, any>;
    theme: typeof theme;
    shouldLightIcon: boolean;
}

interface CalcPopoutStylesInput {
    ref: RefObject<HTMLElement>;
    popoutRef:  RefObject<HTMLUListElement>;
    position: Position;
}

/* UTIL FUNCTIONS */
const calcPopoutStyles = ( input: CalcPopoutStylesInput ) => {
    const { ref, popoutRef, position } = input;
    const refRect = ref.current?.getBoundingClientRect();
    const popoutRefRect = popoutRef.current?.getBoundingClientRect();

    if ( refRect && popoutRefRect ) {
        const SCROLL_HEIGHT = window.innerHeight + window.scrollY;

        let top = refRect.top - 
            ( refRect.height / 2 ) + 
            window.scrollY +
            POPOUT_PADDING;

        const getDefaultVerticalStyles = () => {
            if ( top + popoutRefRect.height > SCROLL_HEIGHT ) {
                top -= popoutRefRect.height;
            }

            return {
                top: `${top}px`
            }
        }

        const getShiftedVertialStyles = () => {
            top += TOOLBAR_HEIGHT;

            if ( top + popoutRefRect.height > SCROLL_HEIGHT ) {
                top -= TOOLBAR_HEIGHT + popoutRefRect.height;
            }

            return {
                top: `${top}px`,
            }
        }

        if ( position === 'left' ) {
            const left = refRect.x -
                ( refRect.width / 2 ) - 
                popoutRefRect.width +
                POPOUT_PADDING;

            if ( left < 0 ) {
                return {
                    left: '0px',
                    ...getShiftedVertialStyles(),
                }
            }
                
            return {
                left: `${left}px`,
                ...getDefaultVerticalStyles(),
            }
        }
        else {
            const left = refRect.x - 
                refRect.width +
                ( popoutRefRect.width / 2 ) -
                POPOUT_PADDING - 2;
                
            if ( left + popoutRefRect.width > window.innerWidth + window.scrollX ) {
                return {
                    right: '0px',
                    ...getShiftedVertialStyles(),
                }
            }

            return {
                left: `${left}px`,
                ...getDefaultVerticalStyles(),
            }
        }
    }

    return {};
}

/* CONSTANTS */
const POPOUT_PADDING = 3;
const TOOLBAR_HEIGHT = 35;

const ToolbarPopout = forwardRef<HTMLElement, Props> ( ( {
    id,
    position,
    items,
    close,
    isActive,
    commands,
    theme,
    shouldLightIcon,
}, ref ) => {
    const popoutRef = useRef<HTMLUListElement>( null );
    const firstMenuItemRef = useRef<HTMLButtonElement>( null );
    const [ popoutStyles, setPopoutStyles ] = useState<Styles>( {} );

    useEffect( () => {
        if (
            typeof ref !== 'function' &&
            ref?.current &&
            isActive
        ) {
            setPopoutStyles( calcPopoutStyles( {
                ref,
                popoutRef,
                position,
            } ) );
        }
    }, [ isActive, ref ] );

    if ( isActive ) {
        setTimeout( () => {
            if ( firstMenuItemRef.current ) {
                firstMenuItemRef.current.focus();
            }
        }, 28 );
    }

    let className = position;

    if ( isActive ) {
        className += ' active';
    }
    else {
        className += ' not-active';
    }

    return (
        <Portal>
            <List id={id} ref={popoutRef}
                className={className}
                style={popoutStyles}>
                {
                    items.map( ( item, index ) => {
                        const { name,
                            tooltip, 
                            icon,
                            iconColor, 
                            iconSVGProps, } = item;
                        const Icon = icon;

                        const handleClick = () => {
                            defaultMarkClick( {
                                item,
                                commands,
                            } );

                            close();
                        }

                        const handleMouseUp = ( event: MouseEvent ) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }

                        return (
                            <Button ref={index === 0 ? firstMenuItemRef : undefined}
                                onMouseUp={handleMouseUp}
                                onClick={handleClick}
                                key={`${name}${index}`}
                                type='button'
                                aria-pressed={false}>
                                {
                                    Icon ? (
                                        <Icon className={shouldLightIcon ? 
                                            'toolbar-icon light' : 'toolbar-icon'}
                                            color={iconColor || theme.toolbarItem} 
                                            size={22} {...iconSVGProps} />   
                                    ) : ''
                                }
                                <Title>{tooltip}</Title>
                            </Button>
                        )
                    } )
                }
            </List>
        </Portal>
    )
} )

export default ToolbarPopout;