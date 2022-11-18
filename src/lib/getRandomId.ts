import { nanoid } from 'nanoid';

export const getRandomId = ( randomness: number=4 ) => {
    return nanoid( randomness );
}