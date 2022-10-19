import * as React from "react";
import { EditorView } from "prosemirror-view";
import styled, { withTheme } from "styled-components";
import ToolbarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";
import theme from "../styles/theme";
import { MenuItem } from "../types";
import { defaultMarkClick } from '../commands/defaultMarkClick';

type Props = {
  tooltip: typeof React.Component | React.FC<any>;
  commands: Record<string, any>;
  view: EditorView;
  theme: typeof theme;
  items: MenuItem[];
  isDarkMode?: boolean;
};

const FlexibleWrapper = styled.div`
  display: flex;
`;

class ToolbarMenu extends React.Component<Props> {
  render() {
    const { view, items } = this.props;
    const { state } = view;
    const Tooltip = this.props.tooltip;

    return (
      <FlexibleWrapper>
        {items.map((item, index) => {
          if (item.name === "separator" && item.visible !== false) {
            return <ToolbarSeparator key={index} />;
          }
          if (item.visible === false || !item.icon) {
            return null;
          }
          const Icon = item.icon;
          const isActive = item.active ? item.active(state) : false;

          return (
            <ToolbarButton
              key={index}
              active={isActive}
              onClick={() => defaultMarkClick( {
                item,
                commands: this.props.commands,
              })}
            >
              <Tooltip tooltip={item.tooltip} placement="top">
                <Icon className={!this.props.isDarkMode && item.iconColor ? 
                  'toolbar-icon light' : 'toolbar-icon'}
                  color={item.iconColor || this.props.theme.toolbarItem} />
              </Tooltip>
            </ToolbarButton>
          );
        })}
      </FlexibleWrapper>
    );
  }
}

export default withTheme(ToolbarMenu);
