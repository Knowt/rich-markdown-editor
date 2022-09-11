"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceHeaderByStrong = exports.getStyleValue = exports.isValidHeading = exports.getHeadingLevelByFontSize = exports.getParsedValue = exports.remToPx = exports.isHTML = void 0;
const isHTML = (str) => {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};
exports.isHTML = isHTML;
const remToPx = (rem) => {
    return (parseFloat(rem) *
        parseFloat(window.getComputedStyle(document.documentElement).fontSize));
};
exports.remToPx = remToPx;
const isRem = (val) => {
    return typeof val === "string" && val.includes("rem");
};
const getParsedValue = (val) => {
    if (!val)
        return NaN;
    return isRem(val) ? exports.remToPx(val) : parseFloat(val);
};
exports.getParsedValue = getParsedValue;
const getHeadingLevelByFontSize = (fontSize) => {
    if (fontSize > 31)
        return 1;
    if (fontSize > 23)
        return 2;
    if (fontSize > 16)
        return 3;
    if (fontSize > 10)
        return 4;
};
exports.getHeadingLevelByFontSize = getHeadingLevelByFontSize;
const isValidHeading = (fontSize, level) => {
    switch (level) {
        case 1:
            return fontSize > 28;
        case 2:
            return fontSize > 20;
        case 3:
            return fontSize > 15;
        case 4:
            return fontSize > 10;
        default:
            return false;
    }
};
exports.isValidHeading = isValidHeading;
const getStyleValue = (el, prop) => {
    return el ? exports.getParsedValue(window.getComputedStyle(el)[prop]) : 0;
};
exports.getStyleValue = getStyleValue;
const replaceHeaderByStrong = (html) => {
    const findHeadersRegex = /<(\/?)h[1,2,3,4,5]\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gm;
    return html.replace(findHeadersRegex, "<$1strong$2>");
};
exports.replaceHeaderByStrong = replaceHeaderByStrong;
//# sourceMappingURL=index.js.map