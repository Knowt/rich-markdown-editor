import styled from "styled-components";
import React, { ReactNode, RefObject, useState, useRef,
  useCallback, useEffect, forwardRef } from 'react';
import useDelay from '../hooks/useDelay';

/* TYPES */
type TooltipPositions = 'top' | 'bottom';

interface Props {
  children: ReactNode;
  id: string;
  position?: TooltipPositions;
  includeArrow?: boolean;
  delayShowTime?: number;
}

interface Styles {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}

/* CONSTANTS */
const TOOLTIP_PADDING = 14;

/* FUNCTIONS */
interface GetTooltipStylesInput {
  ref:  RefObject<HTMLElement>;
  tooltipRef: RefObject<HTMLDivElement>;
  position: TooltipPositions;
}
const getTooltipStyles = ( input: GetTooltipStylesInput ) => {
  const { ref, tooltipRef, position } = input;
  const tooltipRect = tooltipRef.current?.getBoundingClientRect();
  const refRect = ref.current?.getBoundingClientRect();

  if ( tooltipRect && refRect ) {
    if ( position === 'top' ) {
      return {
        left: '50%',
        bottom: `${refRect.height - tooltipRect.height + TOOLTIP_PADDING}px`
      }
    }
  else if ( position === 'bottom' ) {
    return {
        left: `50%`,
        top: `${refRect.height + tooltipRect.height - TOOLTIP_PADDING}px`
      }
    }
  }

  return {};
}

const TooltipWrapper = styled.div`
  display: flex;
  position: absolute;
  padding-inline: 4px;
  font-size: 75%;
  background: ${props => props.theme.toolbarBackground};
  font-family: ${props => props.theme.fontFamily};
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  border-radius: 7px;
  z-index: 100;
  box-shadow: 0px 0px 0.3px ${props => props.theme.toolbarShadow},
              0px 0px 0.9px ${props => props.theme.toolbarShadow},
              0px 0px 1.8px ${props => props.theme.toolbarShadow},
              0px 0px 3.7px ${props => props.theme.toolbarShadow},
              0px 0px 10px ${props => props.theme.toolbarShadow};

  transform: translate( -50%, -50% );
  transition: opacity 0.21s ease,
              visibility 0.21s ease,
              transform 0.21s ease;

  &.not-active {
    opacity: 0;
    visibility: hidden;
  }

  .tooltip {
    display: flex;
    position: relative;

    .pointer {
      position: absolute;
      transform: translate( -50%, -50% );

      &.top {
        left: 50%;
        top: 100%;

        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${props => props.theme.toolbarBackground};
      }

      &.bottom {
        left: 50%;
        top: 0;

        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        
        border-bottom: 8px solid ${props => props.theme.toolbarBackground};
      }
    }
  }

  /* POSITION */
  &.top {
    transform-origin: bottom;
  }

  &.bottom {
    transform-origin: top;
  }

  &.top,
  &.bottom {
      &.not-active {
        transform: scaleY( 0.8 )
                    translate( -50%, -50% );
      }
  }
`;

const Tooltip = forwardRef<HTMLElement, Props>( ( { 
  children,
  id,
  position='top',
  includeArrow=true,
  delayShowTime=0,
}, ref ) => {
  /* HOOKS */
  const tooltipRef = useRef<HTMLDivElement>( null );
  const [ isActive, setIsActive ] = useState<boolean>( false );
  const [ tooltipStyles, setTooltipStyles ] = useState<Styles>( {} );
  const shouldDisplay = useDelay( {
    isActive,
    delayTime: delayShowTime,
  } );

  /* FUNCTIONS */
  const handlePointerOver = useCallback( () => {
    setIsActive( true );
  }, [ isActive ] );

  const handlePointeLeave = useCallback( () => {
    setIsActive( false );
  }, [ isActive ] );

  useEffect( () => {
    if (
        typeof ref !== 'function' &&
        ref?.current
    ) {
        ref.current?.addEventListener( 'pointerover', handlePointerOver );
        ref.current?.addEventListener( 'pointerleave', handlePointeLeave );

        setTooltipStyles( getTooltipStyles( {
            ref,
            tooltipRef,
            position,
        } ) );

        return () => {
            ref.current?.removeEventListener( 'pointerover', handlePointerOver );
            ref.current?.removeEventListener( 'pointerleave', handlePointeLeave );
        }
    }
}, [] );

  return (
    <TooltipWrapper id={id} ref={tooltipRef}
      className={isActive && shouldDisplay ? `active ${position} tooltip-wrapper` : 
        `not-active ${position} tooltip-wrapper`} 
      role='tooltip' style={tooltipStyles}>
        <span className='tooltip'>
            {children}
            {
                includeArrow ? (
                    <span className={`pointer ${position}`}
                      aria-hidden={true} />
                ) : ''
            }
        </span>
    </TooltipWrapper>
  )
} );


export default Tooltip;