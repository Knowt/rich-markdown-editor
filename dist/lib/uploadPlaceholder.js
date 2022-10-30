"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPlaceholder = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const uploadPlaceholder = new prosemirror_state_1.Plugin({
    state: {
        init() {
            return prosemirror_view_1.DecorationSet.empty;
        },
        apply(tr, set) {
            var _a;
            set = set.map(tr.mapping, tr.doc);
            const action = tr.getMeta(this);
            if (action === null || action === void 0 ? void 0 : action.add) {
                if (action.add.replaceExisting) {
                    const $pos = tr.doc.resolve(action.add.pos);
                    if (((_a = $pos.nodeAfter) === null || _a === void 0 ? void 0 : _a.type.name) === "image") {
                        const deco = prosemirror_view_1.Decoration.node($pos.pos, $pos.pos + $pos.nodeAfter.nodeSize, {
                            class: "image-replacement-uploading",
                        }, {
                            id: action.add.id,
                        });
                        set = set.add(tr.doc, [deco]);
                    }
                }
                else {
                    const element = document.createElement("div");
                    element.className = "image placeholder";
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(action.add.file);
                    element.appendChild(img);
                    const deco = prosemirror_view_1.Decoration.widget(action.add.pos, element, {
                        id: action.add.id,
                    });
                    set = set.add(tr.doc, [deco]);
                }
            }
            if (action === null || action === void 0 ? void 0 : action.remove) {
                set = set.remove(set.find(null, null, spec => spec.id === action.remove.id));
            }
            return set;
        },
    },
    props: {
        decorations(state) {
            return this.getState(state);
        },
    },
});
exports.default = uploadPlaceholder;
function findPlaceholder(state, id) {
    const decos = uploadPlaceholder.getState(state);
    const found = decos.find(null, null, spec => spec.id === id);
    return found.length ? [found[0].from, found[0].to] : null;
}
exports.findPlaceholder = findPlaceholder;
//# sourceMappingURL=uploadPlaceholder.js.map