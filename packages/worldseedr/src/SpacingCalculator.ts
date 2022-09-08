import { RandomChooser } from "./RandomChooser";
import { PossibilitySpacing, RandomizedValue, Spacing } from "./types";

/**
 * Utility to generate distances based on possibility schemas.
 */
export class SpacingCalculator {
    public constructor(
        /**
         * Chooses values from arrays of weighted random values.
         */
        private readonly randomChooser: RandomChooser
    ) {}

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Any sort of description for a unit of distance.
     * @returns A valid distance for the given spacing description.
     */
    public calculate(spacing: Spacing): number {
        // Case: number
        if (typeof spacing === "number") {
            return spacing;
        }

        // Case: RandomizedValue<PossibilitySpacing>[]
        if (Array.isArray(spacing)) {
            return this.calculateFromPossibilities(spacing);
        }

        // Case: PossibilitySpacing
        return this.calculateFromPossibility(spacing);
    }

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   A description of a range of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    private calculateFromPossibility(spacing: PossibilitySpacing): number {
        const { roundTo = 1 } = spacing;

        const value = this.randomChooser.randomBetween(spacing.min, spacing.max);

        return Math.round(value / roundTo) * roundTo;
    }

    /**
     * Computes a distance from any description of distance possibilities.
     *
     * @param spacing   Descriptions of ranges of possibilities for spacing.
     * @returns A valid distance for the given spacing description.
     */
    private calculateFromPossibilities(spacing: RandomizedValue<PossibilitySpacing>[]): number {
        return this.calculateFromPossibility(this.randomChooser.chooseAmong(spacing));
    }
}
