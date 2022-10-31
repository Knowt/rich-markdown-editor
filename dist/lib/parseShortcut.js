"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShortcut = void 0;
const SHORTCUT_KEY_MAPPINGS = {
    Mod: {
        mac: '⌘',
        windows: 'Ctrl',
    },
    Alt: {
        windows: 'Alt',
        mac: 'Opt',
    },
};
const parseShortcut = (input) => {
    const { deviceType, shortcut } = input;
    if (!deviceType)
        return undefined;
    let readableShortcut = shortcut.replace(/-/g, '+');
    Object.keys(SHORTCUT_KEY_MAPPINGS).forEach((key) => {
        readableShortcut = readableShortcut.replace(RegExp(String.raw `${key}`, 'g'), SHORTCUT_KEY_MAPPINGS[key][deviceType]);
    });
    return readableShortcut;
};
exports.parseShortcut = parseShortcut;
//# sourceMappingURL=parseShortcut.js.map