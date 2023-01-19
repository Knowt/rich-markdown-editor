"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uploadPlaceholder_1 = __importStar(require("../lib/uploadPlaceholder"));
const types_1 = require("../types");
const prosemirror_state_1 = require("prosemirror-state");
let uploadId = 0;
const insertFiles = function (view, event, pos, files, options) {
    const images = files.filter(file => /image/i.test(file.type));
    if (images.length === 0)
        return;
    const { dictionary, uploadImage, onImageUploadStart, onImageUploadStop, onShowToast } = options;
    if (!uploadImage) {
        console.warn("uploadImage callback must be defined to handle image uploads.");
        return;
    }
    event.preventDefault();
    if (onImageUploadStart)
        onImageUploadStart();
    const { schema } = view.state;
    let complete = 0;
    for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const id = `upload-${uploadId++}`;
        const { tr } = view.state;
        tr.setMeta(uploadPlaceholder_1.default, {
            add: {
                id,
                file,
                pos,
                replaceExisting: options.replaceExisting
            }
        });
        view.dispatch(tr);
        uploadImage(file)
            .then(src => {
            const newImg = new Image();
            newImg.onload = () => {
                const result = uploadPlaceholder_1.findPlaceholder(view.state, id);
                if (result === null) {
                    return;
                }
                const [from, to] = result;
                view.dispatch(view.state.tr
                    .replaceWith(from, to || from, schema.nodes.image.create({ src }))
                    .setMeta(uploadPlaceholder_1.default, { remove: { id } }));
                if (view.state.selection.from === from) {
                    view.dispatch(view.state.tr.setSelection(new prosemirror_state_1.NodeSelection(view.state.doc.resolve(from))));
                }
            };
            newImg.onerror = error => {
                throw error;
            };
            newImg.src = src;
        })
            .catch(error => {
            console.error(error);
            const transaction = view.state.tr.setMeta(uploadPlaceholder_1.default, {
                remove: { id }
            });
            view.dispatch(transaction);
            if (onShowToast) {
                onShowToast(dictionary.imageUploadError, types_1.ToastType.Error);
            }
        })
            .finally(() => {
            complete++;
            if (complete === images.length && onImageUploadStop) {
                onImageUploadStop();
            }
        });
    }
};
exports.default = insertFiles;
//# sourceMappingURL=insertFiles.js.map