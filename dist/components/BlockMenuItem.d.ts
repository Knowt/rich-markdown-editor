import * as React from "react";
import theme from "../styles/theme";
export declare type Props = {
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
declare const _default: React.ForwardRefExoticComponent<{
    disabled?: boolean | undefined;
    title: React.ReactNode;
    icon?: typeof React.Component | React.FC<any> | undefined;
    onClick: () => void;
    selected: boolean;
    iconSVGProps?: any;
    innerRef?: ((ref: HTMLDivElement) => void) | undefined;
    mainSearchKeyword?: string | undefined;
    containerId?: string | undefined;
    shortcut?: string | undefined;
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=BlockMenuItem.d.ts.map