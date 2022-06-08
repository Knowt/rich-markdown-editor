import * as React from "react";
import { theme } from "..";
export declare type Props = {
    title: string;
    theme: typeof theme;
    selected: boolean;
    disabled?: boolean;
    innerRef?: (ref: HTMLDivElement) => void;
    onClick: () => void;
    containerId?: string;
};
declare const _default: React.ForwardRefExoticComponent<{
    disabled?: boolean | undefined;
    title: string;
    onClick: () => void;
    selected: boolean;
    innerRef?: ((ref: HTMLDivElement) => void) | undefined;
    containerId?: string | undefined;
} & {
    theme?: any;
}>;
export default _default;
//# sourceMappingURL=BlockGroupMenuItem.d.ts.map