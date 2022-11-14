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
declare const _default;
export default _default;
//# sourceMappingURL=BlockMenuItem.d.ts.map