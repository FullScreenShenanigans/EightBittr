import { Aliases, AliasesToCodes, AliasKeys, CodesToAliases } from "./types";

/**
 * Converts between character aliases and their key strings.
 */
export class AliasConverter {
    /**
     * Known, allowed aliases for triggers.
     */
    private readonly aliases: Aliases;

    /**
     * A quick lookup table of key aliases to their character codes.
     */
    private readonly keyAliasesToCodes: AliasesToCodes;

    /**
     * A quick lookup table of character codes to their key aliases.
     */
    private readonly keyCodesToAliases: CodesToAliases;

    /**
     * Initializes a new instance of the AliasConverter class.
     *
     * @param aliases   Known, allowed aliases for triggers.
     */
    public constructor(aliases: Aliases = {}) {
        this.aliases = aliases;

        this.keyAliasesToCodes = {
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

        this.keyCodesToAliases = {
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
    }

    /**
     * @returns The stored mapping of aliases to values, with values
     *          mapped to their equivalent key Strings.
     */
    public getAliasesAsKeyStrings(): AliasKeys {
        const output: AliasKeys = {};

        for (const alias in this.aliases) {
            output[alias] = this.getAliasAsKeyStrings(alias);
        }

        return output;
    }

    /**
     * Determines the allowed key strings for a given alias.
     *
     * @param alias   An alias allowed to be passed in, typically a
     *                character code.
     * @returns The mapped key Strings corresponding to that alias,
     *          typically the human-readable Strings representing
     *          input names, such as "a" or "left".
     */
    public getAliasAsKeyStrings(alias: string): string[] {
        return this.aliases[alias].map((aliases) => this.convertAliasToKeyString(aliases));
    }

    /**
     * @param alias   The alias of an input, typically a character code.
     * @returns The human-readable String representing the input name,
     *          such as "a" or "left".
     */
    public convertAliasToKeyString(alias: number | string): string {
        if (typeof alias === "string") {
            return alias;
        }

        if (alias > 96 && alias < 105) {
            return String.fromCharCode(alias - 48);
        }

        if (alias > 64 && alias < 97) {
            return String.fromCharCode(alias);
        }

        return typeof this.keyCodesToAliases[alias] !== "undefined"
            ? this.keyCodesToAliases[alias]
            : "?";
    }

    /**
     * @param key   The number code of an input.
     * @returns The machine-usable character code of the input.
     */
    public convertKeyStringToAlias(key: number | string): number | string {
        if (typeof key === "number") {
            return key;
        }

        if (key.length === 1) {
            return key.charCodeAt(0) - 32;
        }

        return typeof this.keyAliasesToCodes[key] !== "undefined"
            ? this.keyAliasesToCodes[key]
            : -1;
    }
}
