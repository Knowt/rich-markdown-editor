import Extension from "../lib/Extension";
export default class History extends Extension {
    get name(): string;
    keys(): {
        "Mod-z": import("prosemirror-state").Command;
        "Mod-y": import("prosemirror-state").Command;
        "Shift-Mod-z": import("prosemirror-state").Command;
        Backspace: import("prosemirror-state").Command;
    };
    get plugins(): import("prosemirror-state").Plugin<any>[];
}
//# sourceMappingURL=History.d.ts.map