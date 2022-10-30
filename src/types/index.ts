import * as React from "react";
import { EditorState } from "prosemirror-state";

export enum ToastType {
  Error = "error",
  Info = "info",
}

export type MenuItem = {
  icon?: typeof React.Component | React.FC<any>;
  iconColor?: string;
  iconSVGProps?: {
    r?: number;
    cx?: number;
    cy?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  name?: string;
  title?: string;
  shortcut?: string;
  keywords?: string;
  searchKeyword?: string;
  tooltip?: string;
  defaultHidden?: boolean;
  attrs?: Record<string, any>;
  visible?: boolean;
  active?: (state: EditorState) => boolean;
  customOnClick?: () => void;
};

export type EmbedDescriptor = MenuItem & {
  matcher: (url: string) => boolean | [] | RegExpMatchArray;
  component: typeof React.Component | React.FC<any>;
};

export type MenuPosition = {
  left: number;
  top?: number;
  bottom?: number;
  isAbove?: boolean;
  updatedAt: number;
};

export type GroupMenuItem = {
  groupData: GroupData;
  items: (MenuItem | EmbedDescriptor)[];
};

export type GroupData = {
  name: string;
};
