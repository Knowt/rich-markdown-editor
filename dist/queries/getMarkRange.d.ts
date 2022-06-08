import { ResolvedPos, MarkType } from "prosemirror-model";
export default function getMarkRange($pos?: ResolvedPos, type?: MarkType): false | {
    from: number;
    to: number;
    mark: import("prosemirror-model").Mark;
};
//# sourceMappingURL=getMarkRange.d.ts.map