import React from "react";
declare type IconSVGProps = {
    color?: string;
    size?: number;
    r?: number;
    cx?: number;
    cy?: number;
    fill?: string;
    strokeWidth?: number;
    stroke?: string;
};
export declare const CircleIcon: ({ color, size, ...rest }: IconSVGProps) => React.ReactElement<IconSVGProps>;
export declare const RemoveIcon: ({ color, size, }: IconSVGProps) => React.ReactElement<IconSVGProps>;
interface ChevronIconProps {
    fill: string;
    width?: number;
}
export declare const ChevronIcon: ({ fill, width, }: ChevronIconProps) => JSX.Element;
export declare const UnderlineIcon: ({ color, width }: {
    color: any;
    width?: number | undefined;
}) => JSX.Element;
export {};
//# sourceMappingURL=icons.d.ts.map