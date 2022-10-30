import type { DeviceType } from '../types';

/* TYPES */
interface ParseShortCutInput {
    deviceType?: DeviceType;
    shortcut: string;
}

/* CONSTANTS */
const SHORTCUT_KEY_MAPPINGS = {
    Mod: {
        mac: '⌘',
        windows: 'Ctrl',
    },
    Alt: {
        windows: 'Alt',
        mac: 'Opt',
    },
}

/**
 * Returns shortcut in readable tooltip form
 */
export const parseShortcut = ( input: ParseShortCutInput ) => {
    const { deviceType, shortcut } = input;

    if ( !deviceType )
        return undefined;

    let readableShortcut = shortcut.replace( /-/g, '+' );

    Object.keys( SHORTCUT_KEY_MAPPINGS ).forEach( ( key: 'Mod' | 'Alt' ) => {
        readableShortcut = readableShortcut.replace( 
            RegExp(String.raw`${key}`, 'g'), 
            SHORTCUT_KEY_MAPPINGS[ key ][ deviceType ],
        );
    } );

    return readableShortcut;
}