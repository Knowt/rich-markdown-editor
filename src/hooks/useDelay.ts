// dependencies
import { useState, useEffect } from 'react';

/* TYPES */
interface UseDelayInput {
    isActive: boolean;
    delayTime: number;
    type?: 'mount' | 'unmount';
}

/**
 * Delays mounting or unmounting of component.
 * Useful for animating components off or onto the screen
 */
const useDelay = ( input: UseDelayInput ) => {
    const { isActive, delayTime, type='mount' } = input;

    const [ shouldRender, setShouldRender ] = useState( false );

    useEffect( () => {
        let timeoutId: any;

        if ( type === 'unmount' ) {
            if ( isActive && !shouldRender )
                setShouldRender( true );
    
            else if( !isActive && shouldRender )
                timeoutId = setTimeout(
                    () => setShouldRender( false ), 
                    delayTime
                );
        }
        else {
            if ( isActive && !shouldRender )
                timeoutId = setTimeout(
                    () => setShouldRender( true ), 
                    delayTime
                );

            else if( !isActive && shouldRender )
                setShouldRender( false );
        }

        return () => {
            clearTimeout( timeoutId );
        }
    }, [ isActive, delayTime, shouldRender ] );

    return shouldRender;
}

export default useDelay;