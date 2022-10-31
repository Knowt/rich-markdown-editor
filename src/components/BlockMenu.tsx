import React from "react";
import { findParentNode } from "@knowt/prosemirror-utils";
import KnowtCommandMenu, { Props } from "./KnowtCommandMenu";
import BlockMenuItem from "./BlockMenuItem";
import BlockGroupMenuItem from "./BlockGroupMenuItem";
import { getEmbedsGroup, getGroupedMenuItems } from "../menus/block";
import { GroupMenuItem, DeviceType } from "../types";

type PartialBlockMenuProps = Omit<
  Props,
  | "renderMenuItem"
  | "renderGroupMenuItem"
  | "allGroups"
  | "visibleGroups"
  | "onClearSearch"
> &
  Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;

interface BlockMenuProps extends PartialBlockMenuProps {
  isDarkMode?: boolean;
  deviceType?: DeviceType;
}

class BlockMenu extends React.Component<BlockMenuProps> {
  get groupedItems(): GroupMenuItem[] {
    return getGroupedMenuItems(
      this.props.view, 
      this.props.dictionary, 
      this.props.deviceType
    );
  }

  get embedsGroup(): GroupMenuItem {
    return getEmbedsGroup(this.props.embeds);
  }

  get allGroups(): GroupMenuItem[] {
    return [...this.groupedItems, this.embedsGroup];
  }

  // items + embeds groups - filter out default hidden items
  get visibleGroups(): GroupMenuItem[] {
    return this.allGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(({ defaultHidden }) => !defaultHidden),
      }))
      .filter(({ items }) => items.length > 0);
  }

  clearSearch = (clearLength = 0): void => {
    const { state, dispatch } = this.props.view;
    const parent = findParentNode((node) => !!node)(state.selection);

    if (parent) {
      const deleteFrom = Math.max(parent.pos, state.selection.to - clearLength);
      dispatch(state.tr.insertText("", deleteFrom, state.selection.to));
    }
  };

  render() {
    return (
      <KnowtCommandMenu
        {...this.props}
        filterable={true}
        onClearSearch={this.clearSearch}
        allGroups={this.allGroups}
        visibleGroups={this.visibleGroups}
        renderMenuItem={(item, _index, innerRef, options) => {
          return (
            <BlockMenuItem
              key={item.title}
              innerRef={innerRef}
              onClick={options.onClick}
              selected={options.selected}
              icon={item.icon}
              iconSVGProps={item.iconSVGProps}
              title={item.title}
              accentText={item.searchKeyword}
              iconColor={item.iconColor}
              isDarkMode={this.props.isDarkMode}
              itemName={item.name}
            />
          );
        }}
        renderGroupMenuItem={(item, _index, innerRef, options) => {
          return (
            <BlockGroupMenuItem
              innerRef={innerRef}
              key={item.groupData.name}
              title={item.groupData.name}
              selected={options.selected}
              onClick={options.onClick}
            />
          );
        }}
      />
    );
  }
}

export default BlockMenu;
