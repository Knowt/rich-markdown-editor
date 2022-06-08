import * as React from "react";
import { EditorView } from "prosemirror-view";
import theme from "../styles/theme";
import { MenuItem } from "../types";
declare type Props = {
    tooltip: typeof React.Component | React.FC<any>;
    commands: Record<string, any>;
    view: EditorView;
    theme: typeof theme;
    items: MenuItem[];
};
declare class ToolbarMenu extends React.Component<Props> {
    render(): JSX.Element;
}
declare const _default: React.ForwardRefExoticComponent<{
    view: EditorView<any>;
    tooltip: typeof React.Component | React.FC<any>;
    ref?: ((instance: ToolbarMenu | null) => void) | React.RefObject<ToolbarMenu> | null | undefined;
    key?: string | number | null | undefined;
    commands: Record<string, any>;
    items: MenuItem[];
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=ToolbarMenu.d.ts.map