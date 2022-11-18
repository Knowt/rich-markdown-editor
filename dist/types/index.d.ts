import * as React from 'react';
import { EditorState } from 'prosemirror-state';
export declare enum ToastType {
    Error = "error",
    Info = "info"
}
export interface SubMenuItems {
    orientation: 'left' | 'right';
    tooltip?: string;
    items: MenuItem[];
}
export declare type DefaultHighlight = 'highlight_blue' | 'highlight_green' | 'highlight_orange' | 'highlight_red' | 'highlight_yellow';
export declare type DefaultBackground = 'background_blue' | 'background_green' | 'background_orange' | 'background_red' | 'background_yellow';
export declare type SetDefaultHighlight = (highlight: DefaultHighlight) => void;
export declare type SetDefaultBackground = (background: DefaultBackground) => void;
export declare type ExtensionNames = 'strong' | 'code_inline' | 'highlight' | 'background' | 'em' | 'link' | 'placeholder' | 'strikethrough' | 'underline' | 'blockquote' | 'bullet_list' | 'checkbox_item' | 'checkbox_list' | 'code_block' | 'code_fence' | 'embed' | 'br' | 'heading' | 'hr' | 'image' | 'list_item' | 'container_notice' | 'ordered_list' | 'paragraph' | 'table' | 'td' | 'th' | 'tr' | 'emoji' | 'blockmenu';
export declare type MenuItem = {
    icon?: typeof React.Component | React.FC<any>;
    iconColor?: string;
    iconSVGProps?: {
        r?: number;
        cx?: number;
        cy?: number;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        size?: number;
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
    subItems?: SubMenuItems;
};
export declare type EmbedDescriptor = MenuItem & {
    matcher: (url: string) => boolean | [] | RegExpMatchArray;
    component: typeof React.Component | React.FC<any>;
};
export declare type MenuPosition = {
    left: number;
    top?: number;
    bottom?: number;
    isAbove?: boolean;
    updatedAt: number;
};
export declare type GroupMenuItem = {
    groupData: GroupData;
    items: (MenuItem | EmbedDescriptor)[];
};
export declare type GroupData = {
    name: string;
};
export declare type DeviceType = 'mac' | 'windows';
//# sourceMappingURL=index.d.ts.map