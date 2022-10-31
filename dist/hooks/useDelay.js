"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDelay = (input) => {
    const { isActive, delayTime, type = 'mount' } = input;
    const [shouldRender, setShouldRender] = react_1.useState(false);
    react_1.useEffect(() => {
        let timeoutId;
        if (type === 'unmount') {
            if (isActive && !shouldRender)
                setShouldRender(true);
            else if (!isActive && shouldRender)
                timeoutId = setTimeout(() => setShouldRender(false), delayTime);
        }
        else {
            if (isActive && !shouldRender)
                timeoutId = setTimeout(() => setShouldRender(true), delayTime);
            else if (!isActive && shouldRender)
                setShouldRender(false);
        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [isActive, delayTime, shouldRender]);
    return shouldRender;
};
exports.default = useDelay;
//# sourceMappingURL=useDelay.js.map