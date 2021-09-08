import {
    PercentageOption,
    PossibilitySpacing,
    PossibilitySpacingOption,
    RandomNumberBetweenGenerator,
    Spacing,
} from "./types";

/**
 * A random number generator that returns a decimal within [min,max).
 *
 * @param min   A minimum value for output.
 * @param min   A maximum value for output to be under.
 * @returns A random decimal within [min,max).
 */
export type RandomBetweenGenerator = (min: number, max: number) => number;

/**
 * From an Array of potential choice Objects, returns one chosen at random.
 *
 * @param choice   An Array of objects with .percent.
 * @returns One of the choice Objects, chosen at random.
 */
export type OptionChooser<T extends PercentageOption> = (choices: T[]) => T;

/**
 * Utility to generate distances based on possibility schemas.
 */
export class SpacingCalculator {
    /**
     * A random number generator that returns a decimal within [min, max).
     */
    public randomBetween: RandomBetweenGenerator;

    /**
     * From an array of potential choice Objects, returns one chosen at random.
     */
    public chooseAmong: OptionChooser<PossibilitySpacingOption>;

    /**
     * Initializes a new instance of the SpacingCalculator class.
     *
     * @param randomBetween   A random number generator that returns a decimal within [min, max).
     * @param chooseAmong   From an array of potential choice Objects, returns one chosen at random.
     */
    public constructor(
        randomBetween: RandomNumberBetweenGenerator,
        chooseAmong: OptionChooser<PossibilitySpacingOption>
    ) {
        this.randomBetween = randomBetween;
        this.chooseAmong = chooseAmong;
    }

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Any sort of description for a unit of distance.
     * @returns A valid distance for the given spacing description.
     */
    public calculateFromSpacing(spacing: Spacing): number {
        if (!spacing) {
            return 0;
        }

        switch (spacing.constructor) {
            case Array:
                // Case: [min, max]
                if ((spacing as number[])[0].constructor === Number) {
                    return this.randomBetween((spacing as number[])[0], (spacing as number[])[1]);
                }

                // Case: PossibilitySpacingOption[]
                return this.calculateFromPossibilities(spacing as PossibilitySpacingOption[]);

            case Object:
                // Case: PossibilitySpacing
                return this.calculateFromPossibility(spacing as PossibilitySpacing);

            case Number:
                // Case: Number
                return spacing as number;

            default:
                throw new Error(`Unknown spacing requested: '${spacing}'.`);
        }
    }

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   A description of a range of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    public calculateFromPossibility(spacing: PossibilitySpacing): number {
        const spacingObject: PossibilitySpacing = spacing;
        const min: number = spacingObject.min;
        const max: number = spacingObject.max;
        const units: number = spacingObject.units || 1;

        return this.randomBetween(min / units, max / units) * units;
    }

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Descriptions of ranges of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    public calculateFromPossibilities(spacing: PossibilitySpacingOption[]): number {
        return this.calculateFromPossibility(this.chooseAmong(spacing).value);
    }
}
