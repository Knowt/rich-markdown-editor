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
    containerId?: string;
    accentText?: string;
    iconColor?: string;
    isDarkMode?: boolean;
    itemName?: string;
};
declare const _default: React.ForwardRefExoticComponent<{
    disabled?: boolean | undefined;
    title: React.ReactNode;
    icon?: typeof React.Component | React.FC<any> | undefined;
    onClick: () => void;
    selected: boolean;
    iconColor?: string | undefined;
    iconSVGProps?: any;
    isDarkMode?: boolean | undefined;
    innerRef?: ((ref: HTMLDivElement) => void) | undefined;
    accentText?: string | undefined;
    containerId?: string | undefined;
    itemName?: string | undefined;
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=BlockMenuItem.d.ts.map