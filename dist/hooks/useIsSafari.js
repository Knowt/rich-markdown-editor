"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsSafari = void 0;
const react_1 = require("react");
const useIsSafari = () => {
    const [isSafari, setIsSafari] = react_1.useState(false);
    react_1.useEffect(() => {
        if (navigator.userAgent.match(/OS X.*Safari/) &&
            !navigator.userAgent.match(/Chrome/)) {
            setIsSafari(true);
        }
    }, []);
    return isSafari;
};
exports.useIsSafari = useIsSafari;
//# sourceMappingURL=useIsSafari.js.map