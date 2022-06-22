"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_state_1 = require("prosemirror-state");
const Extension_1 = __importDefault(require("../lib/Extension"));
const isInCode_1 = __importDefault(require("../queries/isInCode"));
const BlockMenuTrigger_1 = require("./BlockMenuTrigger");
const OPEN_REGEX = /:\)([0-9a-zA-Z_+-]+)?$/;
const CLOSE_REGEX = /:\)(([0-9a-zA-Z_+-]*\s+)|(\s+[0-9a-zA-Z_+-]+)|[^0-9a-zA-Z_+-]+)$/;
class EmojiTrigger extends Extension_1.default {
    get name() {
        return "emojimenu";
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleClick: () => {
                        this.options.onClose();
                        return false;
                    },
                    handleKeyDown: (view, event) => {
                        if (event.key === "Backspace") {
                            setTimeout(() => {
                                const { pos } = view.state.selection.$from;
                                return BlockMenuTrigger_1.run(view, pos, pos, OPEN_REGEX, (state, match) => {
                                    if (match) {
                                        this.options.onOpen(match[1]);
                                    }
                                    else {
                                        this.options.onClose();
                                    }
                                    return null;
                                });
                            });
                        }
                        if (event.key === "Enter" ||
                            event.key === "ArrowUp" ||
                            event.key === "ArrowDown" ||
                            event.key === "Tab") {
                            const { pos } = view.state.selection.$from;
                            return BlockMenuTrigger_1.run(view, pos, pos, OPEN_REGEX, (state, match) => {
                                return match ? true : null;
                            });
                        }
                        return false;
                    },
                },
            }),
        ];
    }
    inputRules() {
        return [
            new prosemirror_inputrules_1.InputRule(OPEN_REGEX, (state, match) => {
                if (match &&
                    state.selection.$from.parent.type.name === "paragraph" &&
                    !isInCode_1.default(state)) {
                    this.options.onOpen(match[1]);
                }
                return null;
            }),
            new prosemirror_inputrules_1.InputRule(CLOSE_REGEX, (state, match) => {
                if (match) {
                    this.options.onClose();
                }
                return null;
            }),
        ];
    }
}
exports.default = EmojiTrigger;
//# sourceMappingURL=EmojiTrigger.js.map