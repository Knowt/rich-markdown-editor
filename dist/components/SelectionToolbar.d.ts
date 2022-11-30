import * as React from "react";
import { EditorView } from "prosemirror-view";
import { SearchResult } from "./LinkEditor";
import { DeviceType, DefaultHighlight, DefaultBackground, SetDefaultHighlight, SetDefaultBackground } from "../types";
import baseDictionary from "../dictionary";
declare type Props = {
    dictionary: typeof baseDictionary;
    rtl: boolean;
    isTemplate: boolean;
    commands: Record<string, any>;
    onOpen: () => void;
    onClose: () => void;
    onSearchLink?: (term: string) => Promise<SearchResult[]>;
    onClickLink: (href: string, event: MouseEvent) => void;
    onCreateLink?: (title: string) => Promise<string>;
    onShowToast?: (msg: string, code: string) => void;
    view: EditorView;
    isDarkMode?: boolean;
    deviceType?: DeviceType;
    defaultHighlight?: DefaultHighlight;
    defaultBackground?: DefaultBackground;
    setDefaultHighlight?: SetDefaultHighlight;
    setDefaultBackground?: SetDefaultBackground;
    disableBackgroundMarksInToolbar?: boolean;
};
declare type HandleTableDeleteInput = {
    isTableRowSelected: boolean;
    isTableColSelected: boolean;
    isTableSelected: boolean;
};
export default class SelectionToolbar extends React.Component<Props> {
    isActive: boolean;
    menuRef: React.RefObject<HTMLDivElement>;
    isCutInProgress: boolean;
    isTableRowSelected: boolean;
    isTableColSelected: boolean;
    isTableSelected: boolean;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleBeforeCut(): void;
    handleCut(): void;
    handleKeydown(event: KeyboardEvent): void;
    handleTableDelete(input: HandleTableDeleteInput): boolean;
    resetTrackedSelections(): void;
    handleClickOutside: (ev: MouseEvent) => void;
    handleOnCreateLink: (title: string) => Promise<void>;
    handleOnSelectLink: ({ href, from, to, }: {
        href: string;
        from: number;
        to: number;
    }) => void;
    render(): JSX.Element | null;
}
export {};
//# sourceMappingURL=SelectionToolbar.d.ts.map