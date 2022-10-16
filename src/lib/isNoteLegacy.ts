import { LEGACY_NOTE_TIMESTAMP } from './constants';

/**
 * Notes created prior to this timestamp
 * have the possibility of being HTML notes
 * if the note is legacy, then we must check if it is an
 * HTML note and render the note as an HTML doc
 */
export const isNoteLegacy = ( created ) => {
    return created < LEGACY_NOTE_TIMESTAMP;
}