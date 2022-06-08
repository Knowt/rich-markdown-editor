import { InputRule } from "prosemirror-inputrules";
import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
export declare function run(view: any, from: any, to: any, regex: any, handler: any): boolean;
export default class BlockMenuTrigger extends Extension {
    get name(): string;
    get plugins(): Plugin<any>[];
    inputRules(): InputRule[];
}
//# sourceMappingURL=BlockMenuTrigger.d.ts.map