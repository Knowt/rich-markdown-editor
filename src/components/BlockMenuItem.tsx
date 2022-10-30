import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import styled, { withTheme } from "styled-components";
import theme from "../styles/theme";

export type Props = {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  theme: typeof theme;
  icon?: typeof React.Component | React.FC<any>;
  iconSVGProps?: any;
  innerRef?: (ref: HTMLDivElement) => void;
  title: React.ReactNode;
  shortcut?: string;
  containerId?: string;
  mainSearchKeyword?: string;
};

function BlockMenuItem({
  selected,
  disabled,
  onClick,
  title,
  icon,
  iconSVGProps,
  innerRef,
  mainSearchKeyword,
  containerId = "block-menu-container",
  theme
}: Props) {
  const Icon = icon;

  const ref = React.useCallback(
    (node) => {
      innerRef?.(node);
      if (selected && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => parent.id !== containerId,
        });
      }
    },
    [selected, containerId]
  );

  return (
    <MenuItem
      selected={selected}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      <Group>
        {Icon && (
          <>
            <Icon color={theme.blockToolbarIconColor} size={20} {...iconSVGProps} />
            &nbsp;&nbsp;
          </>
        )}
        <Title>{title}</Title>
      </Group>
      <Group>
        {mainSearchKeyword && (
          <SearchKeyword>{mainSearchKeyword}</SearchKeyword>
        )}
      </Group>
    </MenuItem>
  );
}

const MenuItem = styled.button<{
  selected: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 17px;
  line-height: 1;
  width: 100%;
  height: 40px;
  cursor: pointer;
  border: none;
  opacity: ${(props) => (props.disabled ? ".5" : "1")};
  color: ${(props) =>
    props.selected
      ? props.theme.blockToolbarTextSelected
      : props.theme.blockToolbarText};
  background: ${(props) =>
    props.selected
      ? props.theme.blockToolbarSelectedBackground ||
        props.theme.blockToolbarTrigger
      : "none"};
  padding: 0 16px;
  outline: none;

  &:hover,
  &:active {
    color: ${(props) => props.theme.blockToolbarTextSelected};
    background: ${(props) =>
      props.selected
        ? props.theme.blockToolbarSelectedBackground ||
          props.theme.blockToolbarTrigger
        : props.theme.blockToolbarHoverBackground};
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  margin-right: 60px;
`;

const SearchKeyword = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: ${(props) => props.theme.knowtGreen};
  background-color: ${(props) => props.theme.blockToolbarTagBackgroundColor};
`;

export default withTheme(BlockMenuItem);
