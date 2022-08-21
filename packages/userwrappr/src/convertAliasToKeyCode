const aliasesToKeyCodes: Record<string, number> = {
    backspace: 8,
    ctrl: 17,
    down: 40,
    enter: 13,
    escape: 27,
    left: 37,
    right: 39,
    shift: 16,
    space: 32,
    up: 38,
};

/**
 * @param alias   The human-readable String representing the input name,
 *                such as "a" or "left".
 * @param keyCode The alias of an input, typically a character code.
 */
export const convertAliasToKeyCode = (alias: string) => {
    return alias.length === 1 ? alias.charCodeAt(0) - 32 : aliasesToKeyCodes[alias];
};
