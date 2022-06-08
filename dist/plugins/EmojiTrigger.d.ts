import { InputRule } from "prosemirror-inputrules";
import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
export default class EmojiTrigger extends Extension {
    get name(): string;
    get plugins(): Plugin<any>[];
    inputRules(): InputRule[];
}
//# sourceMappingURL=EmojiTrigger.d.ts.map