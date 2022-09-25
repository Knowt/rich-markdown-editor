"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const resize_observer_polyfill_1 = __importDefault(require("resize-observer-polyfill"));
function useResizeObserver(ref, callback) {
    const callbackRef = react_1.useRef(callback);
    react_1.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    react_1.useLayoutEffect(() => {
        if (!ref.current)
            return;
        const ro = new resize_observer_polyfill_1.default((entries) => {
            if (!Array.isArray(entries))
                return;
            const entry = entries[0];
            callbackRef.current(entry.contentRect);
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
}
exports.default = useResizeObserver;
//# sourceMappingURL=useResizeObserver.js.map