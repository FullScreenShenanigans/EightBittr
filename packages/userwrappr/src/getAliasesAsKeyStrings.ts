import { Aliases, AliasKeys } from "inputwritr";

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
 * @param alias   The alias of an input, typically a character code.
 * @returns The human-readable String representing the input name,
 *          such as "a" or "left".
 */
const convertAliasToKeyString = (alias: number | string) => {
    if (typeof alias === "string") {
        return alias;
    }

    if (alias > 96 && alias < 105) {
        return String.fromCharCode(alias - 48);
    }

    if (alias > 64 && alias < 97) {
        return String.fromCharCode(alias);
    }

    return typeof keyCodesToAliases[alias] !== "undefined" ? keyCodesToAliases[alias] : "?";
};

/**
 * Determines the allowed key strings for a given alias.
 *
 * @param aliases  Maps event types to their lists of aliases.
 * @param alias   An alias allowed to be passed in, typically a
 *                character code.
 * @returns The mapped key Strings corresponding to that alias,
 *          typically the human-readable Strings representing
 *          input names, such as "a" or "left".
 */
const getAliasAsKeyStrings = (aliases: Aliases, alias: string) => {
    return aliases[alias].map((aliases) => convertAliasToKeyString(aliases));
};

/**
 * @param aliases  Maps event types to their lists of aliases.
 * @returns The stored mapping of aliases to values, with values
 *          mapped to their equivalent key Strings.
 */
export const getAliasesAsKeyStrings = (aliases: Aliases) => {
    const output: AliasKeys = {};

    for (const alias in aliases) {
        output[alias] = getAliasAsKeyStrings(aliases, alias);
    }

    return output;
};
