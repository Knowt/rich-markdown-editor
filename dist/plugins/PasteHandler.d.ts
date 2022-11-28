import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
export default class PasteHandler extends Extension {
    get name(): string;
    get defaultOptions(): {
        disableLinkPaste: boolean;
        disableCodePaste: boolean;
    };
    get plugins(): Plugin<any>[];
}
//# sourceMappingURL=PasteHandler.d.ts.map