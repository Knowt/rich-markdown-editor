// dependencies
import { useEffect, useState } from 'react';


export const useIsSafari = () => {
    /* HOOKS */
    const [ isSafari, setIsSafari ] = useState<boolean>( false );

    useEffect( () => {
        if (
            navigator.userAgent.match(/OS X.*Safari/) && 
            !navigator.userAgent.match(/Chrome/)
        ) {
            setIsSafari( true );
        }
    }, [] );

    return isSafari;
}