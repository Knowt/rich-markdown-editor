"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_gapcursor_1 = require("prosemirror-gapcursor");
const Extension_1 = __importDefault(require("../lib/Extension"));
const isModKey_1 = __importDefault(require("../lib/isModKey"));
class Keys extends Extension_1.default {
    get name() {
        return "keys";
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleDOMEvents: {
                        blur: this.options.onBlur,
                        focus: this.options.onFocus,
                    },
                    handleKeyDown: (view, event) => {
                        var _a;
                        const { state, dispatch } = view;
                        if (state.selection instanceof prosemirror_state_1.AllSelection) {
                            if (event.key === "ArrowUp") {
                                const selection = prosemirror_state_1.Selection.atStart(state.doc);
                                dispatch(state.tr.setSelection(selection));
                                return true;
                            }
                            if (event.key === "ArrowDown") {
                                const selection = prosemirror_state_1.Selection.atEnd(state.doc);
                                dispatch(state.tr.setSelection(selection));
                                return true;
                            }
                        }
                        if (state.selection instanceof prosemirror_gapcursor_1.GapCursor) {
                            if (event.key === "Enter") {
                                dispatch(state.tr.insert(state.selection.from, state.schema.nodes.paragraph.create({})));
                                dispatch(state.tr.setSelection(prosemirror_state_1.TextSelection.near(state.doc.resolve(state.selection.from), -1)));
                                return true;
                            }
                        }
                        if (!isModKey_1.default(event)) {
                            return false;
                        }
                        if (event.key === "s") {
                            event.preventDefault();
                            this.options.onSave();
                            return true;
                        }
                        if (event.key === "Enter") {
                            event.preventDefault();
                            this.options.onSaveAndExit();
                            return true;
                        }
                        if (event.key === "Escape") {
                            event.preventDefault();
                            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onCancel();
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    }
}
exports.default = Keys;
//# sourceMappingURL=Keys.js.map