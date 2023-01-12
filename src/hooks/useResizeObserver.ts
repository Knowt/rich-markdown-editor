import {useLayoutEffect, useEffect, RefObject, useRef} from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useResizeObserver(
    ref: RefObject<HTMLElement>,
    callback: (entry: DOMRectReadOnly) => void,
    readOnly?: boolean,
): void {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useLayoutEffect(() => {
        if (!ref.current || readOnly) return;

        const ro = new ResizeObserver((entries) => {
            if (!Array.isArray(entries)) return;
            const entry = entries[0];
            callbackRef.current(entry.contentRect as DOMRectReadOnly);
        });

        ro.observe(ref.current);

        return () => ro.disconnect();
    }, []);
}
