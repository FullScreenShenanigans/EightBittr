const keyCodesToAliases: Record<number, string> = {
    8: "backspace",
    13: "enter",
    16: "shift",
    17: "ctrl",
    27: "escape",
    32: "space",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
};

/**
 * @param keyCode   The alias of an input, typically a character code.
 * @returns The human-readable String representing the input name,
 *          such as "a" or "left".
 */
export const convertKeyCodeToAlias = (keyCode: number) => {
    if (keyCode > 96 && keyCode < 105) {
        return String.fromCharCode(keyCode - 48);
    }

    if (keyCode > 64 && keyCode < 97) {
        return String.fromCharCode(keyCode);
    }

    return keyCodesToAliases[keyCode];
};
