import { IPercentageOption, IPossibilitySpacing, IPossibilitySpacingOption, Spacing } from "./IWorldSeedr";

/**
 * A random number generator that returns a decimal within [min,max).
 *
 * @param min   A minimum value for output.
 * @param min   A maximum value for output to be under.
 * @returns A random decimal within [min,max).
 */
export type IRandomBetweenGenerator = (min: number, max: number) => number;

/**
 * From an Array of potential choice Objects, returns one chosen at random.
 *
 * @param choice   An Array of objects with .percent.
 * @returns One of the choice Objects, chosen at random.
 */
export type IOptionChooser<T extends IPercentageOption> = (choices: T[]) => T;

/**
 * Utility to generate distances based on possibility schemas.
 */
export interface ISpacingCalculator {
    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Any sort of description for a unit of distance.
     * @returns A valid distance for the given spacing description.
     */
    calculateFromSpacing(spacing: Spacing): number;

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   A description of a range of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    calculateFromPossibility(spacing: IPossibilitySpacing): number;

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Descriptions of ranges of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number;
}
