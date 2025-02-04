"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dark = exports.light = exports.base = void 0;
const colors = {
    black: "#000",
    almostBlack: "#1d1e1e",
    lightBlack: "#333333",
    lighterBlack: "#5b5b5b",
    almostWhite: "#E6E6E6",
    white: "#FFF",
    white10: "rgba(255, 255, 255, 0.1)",
    white40: "rgba(255, 255, 255, 0.4)",
    black10: "rgba(0, 0, 0, 0.1)",
    primary: "#1AB6FF",
    greyLight: "#F4F7FA",
    grey: "#E8EBED",
    greyMid: "#C5CCD3",
    greyDark: "#DAE1E9",
    knowtOffWhite: "#F7F7F7",
    knowtOffWhite2: "#FAFAFA",
    knowtGreen: "#50D2C2",
    knowtGreyLight: "#F1F0F1",
    knowtGrey: "#E9E9E9",
    knowtGreyMid: "#BBB",
    knowtGreyStrong: "#666666",
    highlights: {
        red: "#FFDBDB",
        orange: "#FCE7D2",
        yellow: "#FFFCCF",
        green: "#E4FCD7",
        blue: "#D9EDFF",
    },
};
exports.base = Object.assign(Object.assign({}, colors), { fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen, Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif", fontFamilyMono: "'SFMono-Regular',Consolas,'Liberation Mono', Menlo, Courier,monospace", fontWeight: 400, zIndex: 100, link: colors.primary, placeholder: colors.knowtGreyMid, textSecondary: "#4E5C6E", textLight: colors.white, textHighlight: "#b3e7ff", textHighlightForeground: colors.black, selected: colors.primary, codeComment: "#6a737d", codePunctuation: "#5e6687", codeNumber: "#d73a49", codeProperty: "#c08b30", codeTag: "#3d8fd1", codeString: "#032f62", codeSelector: "#6679cc", codeAttr: "#c76b29", codeEntity: "#22a2c9", codeKeyword: "#d73a49", codeFunction: "#6f42c1", codeStatement: "#22a2c9", codePlaceholder: "#3d8fd1", codeInserted: "#202746", codeImportant: "#c94922", blockToolbarBackground: colors.white, blockToolbarTrigger: colors.greyMid, blockToolbarTriggerIcon: colors.white, blockToolbarItem: colors.almostBlack, blockToolbarIcon: colors.knowtGreyStrong, blockToolbarIconSelected: colors.black, blockToolbarText: colors.black, blockToolbarTextSelected: colors.black, blockToolbarSelectedBackground: colors.knowtOffWhite, blockToolbarHoverBackground: colors.knowtOffWhite2, blockToolbarDivider: colors.knowtGrey, blockToolbarExpandArrowColor: colors.black, blockToolbarIconColor: "#4E5C6E", blockToolbarTagBackgroundColor: "#ecf9f7", noticeInfoBackground: "#F5BE31", noticeInfoText: colors.almostBlack, noticeTipBackground: "#9E5CF7", noticeTipText: colors.white, noticeWarningBackground: "#FF5C80", noticeWarningText: colors.white });
exports.light = Object.assign(Object.assign({}, exports.base), { background: "#f4f4f4", text: colors.almostBlack, code: colors.lightBlack, cursor: colors.black, divider: colors.greyMid, linkHoverBackground: "#dbf2ff", toolbarBackground: colors.white, toolbarShadow: colors.knowtGrey, toolbarHoverBackground: colors.knowtGreyLight, toolbarInput: colors.white10, toolbarItem: colors.almostBlack, toolbarShortcutText: colors.knowtGreyStrong, tableDivider: colors.greyMid, tableSelected: colors.primary, tableSelectedBackground: "#E5F7FF", quote: colors.greyDark, codeBackground: colors.greyLight, codeBorder: colors.grey, horizontalRule: colors.greyMid, imageErrorBackground: colors.greyLight, scrollbarBackground: colors.greyLight, scrollbarThumb: colors.greyMid });
exports.dark = Object.assign(Object.assign({}, exports.base), { background: colors.almostBlack, text: colors.almostWhite, textSecondary: colors.white40, code: colors.almostWhite, cursor: colors.white, divider: "#4E5C6E", placeholder: colors.white40, linkHover: '#0c7eb3', linkHoverBackground: "#b8e5ff", blockToolbarBackground: colors.lightBlack, blockToolbarText: colors.almostWhite, blockToolbarHoverBackground: colors.black10, blockToolbarSelectedBackground: colors.lighterBlack, blockToolbarTextSelected: colors.almostWhite, blockToolbarIconColor: colors.almostWhite, blockToolbarTagBackgroundColor: colors.lighterBlack, blockToolbarExpandArrowColor: colors.white, toolbarBackground: colors.lighterBlack, toolbarShadow: colors.lightBlack, toolbarHoverBackground: colors.knowtGreyStrong, toolbarInput: colors.black10, toolbarItem: colors.white, toolbarShortcutText: colors.knowtGreyMid, tableDivider: colors.lightBlack, tableSelected: colors.primary, tableSelectedBackground: "#002333", quote: colors.greyDark, codeBackground: colors.black, codeBorder: colors.lighterBlack, codeString: "#3d8fd1", horizontalRule: colors.lightBlack, imageErrorBackground: "rgba(0, 0, 0, 0.5)", scrollbarBackground: colors.black, scrollbarThumb: colors.lightBlack });
exports.default = exports.light;
//# sourceMappingURL=theme.js.map