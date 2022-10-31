import React from 'react';
import type { MenuItem as Item } from '../types';
import theme from "../styles/theme";
declare type Position = 'left' | 'right';
interface Props {
    id: string;
    position: Position;
    items: Item[];
    close: () => void;
    isActive: boolean;
    commands: Record<string, any>;
    theme: typeof theme;
    shouldLightIcon: boolean;
}
declare const ToolbarPopout: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export default ToolbarPopout;
//# sourceMappingURL=ToolbarPopout.d.ts.map