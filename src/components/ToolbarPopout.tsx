import React, { forwardRef, RefObject, useRef, useEffect, MouseEvent,
    useState } from 'react';
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
            filter: saturate( 1100% ) brightness( 90% );
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

/* CONSTANTS */
const POPOUT_PADDING = 5;
const TOOLBAR_HEIGHT = 35;

/* FUNCTIONS */
interface CalcPopoutStylesInput {
    ref: RefObject<HTMLElement>;
    popoutRef:  RefObject<HTMLUListElement>;
    position: Position;
}
const calcPopoutStyles = ( input: CalcPopoutStylesInput ) => {
    const { ref, popoutRef, position } = input;
    const refRect = ref.current?.getBoundingClientRect();
    const popoutRefRect = popoutRef.current?.getBoundingClientRect();

    if ( refRect && popoutRefRect ) {
        if ( position === 'left' ) {
            const left = refRect.x - 
                refRect.width - 
                popoutRefRect.width +
                POPOUT_PADDING;

            if ( left < 0 ) {
                let top = refRect.top - 
                     ( refRect.width / 2 ) - 
                     POPOUT_PADDING + 
                     TOOLBAR_HEIGHT;

                if ( top + popoutRefRect.height > window.innerHeight ) {
                    return {
                        left: '0px',
                        top: `${refRect.top - popoutRefRect.height - TOOLBAR_HEIGHT / 2}px`,
                    }
                }

                return {
                    left: '0px',
                    top: `${top}px`,
                }
            }
                
            return {
                left: `${left}px`,
                top: `${refRect.top - refRect.width / 2 - POPOUT_PADDING}px`,
            }
        }
        else {
            const left = refRect.x - 
                refRect.width +
                ( popoutRefRect.width / 2 ) -
                POPOUT_PADDING;
                
            if ( left + popoutRefRect.width > window.innerWidth ) {
                let top = refRect.top - 
                    ( refRect.width / 2 ) - 
                    POPOUT_PADDING;

                if ( top + popoutRefRect.height > window.innerHeight ) {
                    return {
                        right: '0px',
                        top: `${top - popoutRefRect.height - POPOUT_PADDING}px`,
                    }
                }

                return {
                    right: '0px',
                    top: `${top + TOOLBAR_HEIGHT}px`,
                }
            }
            return {
                left : `${left}px`,
                top: `${refRect.top - refRect.width / 2 - POPOUT_PADDING}px`,
            }
        }
    }

    return {};
}

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

    let className = position;

    if ( isActive ) {
        className += ' active';
    }
    else {
        className += ' not-active';
    }

    useEffect( () => {
        if (
            typeof ref !== 'function' &&
            ref?.current
        ) {
            setPopoutStyles( calcPopoutStyles( {
                ref,
                popoutRef,
                position,
            } ) );
        }
    }, [ isActive ] );

    if ( isActive ) {
        setTimeout( () => {
            if ( firstMenuItemRef.current ) {
                firstMenuItemRef.current.focus();
            }
        }, 28 );
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