import React from "react";
import { EditorView } from "prosemirror-view";
import theme from "../styles/theme";
import { MenuItem } from "../types";
declare type Props = {
    commands: Record<string, any>;
    view: EditorView;
    theme: typeof theme;
    items: MenuItem[];
    isDarkMode?: boolean;
};
declare class ToolbarMenu extends React.Component<Props> {
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<{
    view: EditorView;
    ref?: ((instance: ToolbarMenu | null) => void) | React.RefObject<ToolbarMenu> | null | undefined;
    key?: string | number | null | undefined;
    commands: Record<string, any>;
    items: MenuItem[];
    isDarkMode?: boolean | undefined;
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=ToolbarMenu.d.ts.map