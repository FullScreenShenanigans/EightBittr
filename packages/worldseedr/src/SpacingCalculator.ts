import { IOptionChooser, IRandomBetweenGenerator, ISpacingCalculator } from "./ISpacingCalculator";
import { IPossibilitySpacing, IPossibilitySpacingOption, IRandomNumberBetweenGenerator, Spacing } from "./IWorldSeedr";

/**
 * Utility to generate distances based on possibility schemas.
 */
export class SpacingCalculator implements ISpacingCalculator {
    /**
     * A random number generator that returns a decimal within [min, max).
     */
    public randomBetween: IRandomBetweenGenerator;

    /**
     * From an array of potential choice Objects, returns one chosen at random.
     */
    public chooseAmong: IOptionChooser<IPossibilitySpacingOption>;

    /**
     * Initializes a new instance of the SpacingCalculator class.
     *
     * @param randomBetween   A random number generator that returns a decimal within [min, max).
     * @param chooseAmong   From an array of potential choice Objects, returns one chosen at random.
     */
    public constructor(randomBetween: IRandomNumberBetweenGenerator, chooseAmong: IOptionChooser<IPossibilitySpacingOption>) {
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

                // Case: IPossibilitySpacingOption[]
                return this.calculateFromPossibilities(spacing as IPossibilitySpacingOption[]);

            case Object:
                // Case: IPossibilitySpacing
                return this.calculateFromPossibility(spacing as IPossibilitySpacing);

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
    public calculateFromPossibility(spacing: IPossibilitySpacing): number {
        const spacingObject: IPossibilitySpacing = spacing;
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
    public calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number {
        return this.calculateFromPossibility(this.chooseAmong(spacing).value);
    }
}
