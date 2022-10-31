import React, { ReactNode } from 'react';
declare type TooltipPositions = 'top' | 'bottom';
interface Props {
    children: ReactNode;
    id: string;
    position?: TooltipPositions;
    includeArrow?: boolean;
    delayShowTime?: number;
}
declare const Tooltip: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export default Tooltip;
//# sourceMappingURL=Tooltip.d.ts.map