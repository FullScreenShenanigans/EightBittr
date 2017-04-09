import { IAliasKeys } from "./IInputWritr";

/**
 * Converts between character aliases and their key strings.
 */
export interface IAliasConverter {
    /**
     * @returns The stored mapping of aliases to values, with values
     *          mapped to their equivalent key Strings.
     */
    getAliasesAsKeyStrings(): IAliasKeys;

    /**
     * Determines the allowed key strings for a given alias.
     * 
     * @param alias   An alias allowed to be passed in, typically a
     *                character code.
     * @returns The mapped key Strings corresponding to that alias,
     *          typically the human-readable Strings representing 
     *          input names, such as "a" or "left".
     */
    getAliasAsKeyStrings(alias: string): string[];

    /**
     * @param alias   The alias of an input, typically a character code.
     * @returns The human-readable String representing the input name,
     *          such as "a" or "left".
     */
    convertAliasToKeyString(alias: any): string;

    /**
     * @param key   The number code of an input.
     * @returns The machine-usable character code of the input.
     */
    convertKeyStringToAlias(key: number | string): number | string;
}
