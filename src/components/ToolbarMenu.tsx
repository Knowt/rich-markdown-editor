import React, { useRef, Component, useState } from "react";
import { EditorView } from "prosemirror-view";
import styled, { withTheme } from "styled-components";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";
import theme from "../styles/theme";
import { MenuItem, SubMenuItems } from "../types";
import { defaultMarkClick } from '../commands/defaultMarkClick';
import Tooltip from './Tooltip';
import { EditorState } from "prosemirror-state";
import { ChevronIcon } from '../icons';
import ToolbarPopout from './ToolbarPopout';

const FlexibleWrapper = styled.div`
  display: flex;
`;

const MainIconWrapper = styled.div`
  display: flex;
  position: relative;

  .tooltip-wrapper {
    text-align: center;

    .tooltip {
      flex-direction: column;

      .shortcut {
        font-size: 85%;
        margin-top: 2px;
        color: ${props => props.theme.toolbarShortcutText};
      }
    }
  }

  @media screen and ( max-width: 800px ) {
    .tooltip-wrapper {
      display: none;
    }
  }
`;

/* CONSTANTS */
const TOOLTIP_DELAY = 500;

interface ToolbarSubItemsProps {
  id: string;
  subItems: SubMenuItems;
  theme: typeof theme;
  commands: Record<string, any>;
  shouldLightIcon: boolean;
}
const ToolbarSubItems = ( {
  id,
  subItems,
  theme,
  commands,
  shouldLightIcon,
}: ToolbarSubItemsProps ) => {
  const { orientation, tooltip, items } = subItems;

  const [ isActive, setIsActive ] = useState<boolean>( false );
  const ref = useRef<HTMLButtonElement>( null );

  const toggleActive = () => {
    setIsActive( state => !state );
  }

  const closePopout = () => {
    setIsActive( false );
  }

  const ariaControls = `${id}-popout`;

  return (
    <>
      <ToolbarButton ref={ref}
        className='chevron-toolbar-button'
        type='button'
        showBackgroundOnActive={true}
        onClick={toggleActive}
        aria-label={tooltip}
        aria-pressed={isActive}
        aria-controls={ariaControls}
        active={isActive}
        aria-describedby={id}
        style={orientation === 'left' ? {
          transform: 'rotate(180deg)',
          } : {}}>
        <ChevronIcon fill={theme.blockToolbarExpandArrowColor} />
      </ToolbarButton>
      {
        tooltip ? (
          <Tooltip id={id} ref={ref} 
            delayShowTime={TOOLTIP_DELAY} position='top'>
              <p className='item-name'>
                {tooltip}
              </p>
          </Tooltip>
        ) : ''
      }
      <ToolbarPopout id={ariaControls}
        ref={ref}
        position={orientation}
        items={items}
        isActive={isActive} 
        close={closePopout}
        commands={commands}
        theme={theme}
        shouldLightIcon={shouldLightIcon} />
    </>
  );
}

interface ToolbarItemProps {
  item: MenuItem;
  theme: typeof theme;
  commands: Record<string, any>;
  view: EditorView;
  state: EditorState;
  isDarkMode?: boolean;
  index: number;
}

const ToolbarItem = ( {
  item,
  theme,
  commands,
  state,
  isDarkMode,
  index,
}: ToolbarItemProps ) => {
  /* HOOKS */
  const ref = useRef<HTMLButtonElement>( null );

  const Icon = item.icon as typeof Component;
  const isActive = item.active ? item.active(state) : false;
  const id = `${item.name}${index}`;
  const shouldLightIcon = !!( !isDarkMode && 
    ( item.iconColor || item?.iconSVGProps?.fill ) );

  return (
    <MainIconWrapper>
      {
          item.subItems?.orientation === 'left' ? (
            <ToolbarSubItems id={`${item.name}-left${index}`}
              subItems={item.subItems}
              theme={theme}
              commands={commands}
              shouldLightIcon={shouldLightIcon} />
          ) : ''
      }
      <ToolbarButton
        className='toolbar-selection-item-button'
        ref={ref}
        active={isActive}
        type='button'
        aria-pressed={isActive}
        aria-describedby={id}
        onClick={() => defaultMarkClick( {
          item,
          commands,
        })}
      >
        <Icon className={shouldLightIcon ? 
          'toolbar-icon light' : 'toolbar-icon'}
          color={item.iconColor || theme.toolbarItem}
          {...item.iconSVGProps} />
      </ToolbarButton>
      {
        item.subItems?.orientation === 'right' ? (
          <ToolbarSubItems id={`${item.name}-right${index}`}
            subItems={item.subItems}
            theme={theme}
            commands={commands}
            shouldLightIcon={shouldLightIcon} />
        ) : ''
      }
      <Tooltip id={id} ref={ref} delayShowTime={TOOLTIP_DELAY} position='top'>
          <p className='item-name'>
            {item.tooltip}
          </p>
          {
            item.shortcut ? (
              <p className='shortcut'>
                {item.shortcut}
              </p>
            ) : ''
          }
      </Tooltip>
    </MainIconWrapper>
  );
}

type Props = {
  commands: Record<string, any>;
  view: EditorView;
  theme: typeof theme;
  items: MenuItem[];
  isDarkMode?: boolean;
};

class ToolbarMenu extends React.Component<Props> {
  render() {
    const { view, items } = this.props;
    const { state } = view;

    return (
      <FlexibleWrapper>
        {items.map((item, index) => {
          if (item.name === "separator" && item.visible !== false) {
            return <ToolbarSeparator key={index} />;
          }
          if (item.visible === false || !item.icon) {
            return '';
          }

          return (
            <ToolbarItem key={index}
              item={item} theme={this.props.theme}
              commands={this.props.commands}
              view={view} state={state}
              isDarkMode={this.props.isDarkMode}
              index={index} />
          );
        })}
      </FlexibleWrapper>
    );
  }
}

export default withTheme(ToolbarMenu);