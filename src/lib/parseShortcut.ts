
interface ParseShortCutInput {
    deviceType?: 'Mac' | 'Windows';
    shortcut: string;
}
/**
 * Returns shortcut in readable tooltip form
 */
export const parseShortcut = ( input: ParseShortCutInput ) => {
    const { deviceType, shortcut } = input;

    return shortcut;
}