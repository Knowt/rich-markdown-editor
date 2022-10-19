import React, { useRef, Component } from "react";
import { EditorView } from "prosemirror-view";
import styled, { withTheme } from "styled-components";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";
import theme from "../styles/theme";
import { MenuItem } from "../types";
import { defaultMarkClick } from '../commands/defaultMarkClick';
import Tooltip from './Tooltip';
import { EditorState } from "prosemirror-state";

const FlexibleWrapper = styled.div`
  display: flex;
`;

const RelativeWrapper = styled.div`
  display: flex;
  position: relative;
`;

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

  return (
    <RelativeWrapper>
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
        {/** item.tooltip */}
        <Icon className={!isDarkMode && item.iconColor ? 
          'toolbar-icon light' : 'toolbar-icon'}
          color={item.iconColor || theme.toolbarItem} />
      </ToolbarButton>
      <Tooltip id={id} ref={ref} delayShowTime={500}>
          Text fsdafsd
      </Tooltip>
    </RelativeWrapper>
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