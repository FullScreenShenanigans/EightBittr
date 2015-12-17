// @ifdef INCLUDE_DEFINITIONS
/// <reference path="WorldSeedr.ts" />
/// <reference path="SpacingCalculator.d.ts" />
// @endif

// @include ../Source/SpacingCalculator.d.ts

module WorldSeedr {
    "use strict";

    /**
     * Utility to generate distances based on possibility schemas.
     */
    export class SpacingCalculator implements ISpacingCalculator {
        /**
         * @returns A number in [min, max] at random.
         */
        randomBetween: IRandomBetweenGenerator;

        /**
         * From an Array of potential choice Objects, returns one chosen at random.
         */
        chooseAmong: IOptionChooser<IPossibilitySpacingOption>;

        /**
         * Initializes a new instance of the SpacingCalculator class.
         * 
         * @param randomBetween 
         * @param chooseAmong
         */
        constructor(randomBetween: IRandomNumberGenerator, chooseAmong: IOptionChooser<IPossibilitySpacingOption>) {
            this.randomBetween = randomBetween;
            this.chooseAmong = chooseAmong;
        }

        /**
         * Computes a distance from any description of distance possibilities.
         * 
         * @param spacing   Any sort of description for a unit of distance.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromSpacing(spacing: Spacing): number {
            if (!spacing) {
                return 0;
            }

            switch (spacing.constructor) {
                case Array:
                    // Case: [min, max]
                    if ((<number[]>spacing)[0].constructor === Number) {
                        return this.randomBetween((<number[]>spacing)[0], (<number[]>spacing)[1]);
                    }

                    // Case: IPossibilitySpacingOption[]
                    return this.calculateFromPossibilities(<IPossibilitySpacingOption[]>spacing);

                case Object:
                    // Case: IPossibilitySpacing
                    return this.calculateFromPossibility(<IPossibilitySpacing>spacing);

                case Number:
                    // Case: Number
                    return <number>spacing;

                default:
                    throw new Error("Unknown spacing requested: '" + spacing + "'.");
            }
        }

        /**
         * Computes a distance from any description of distance possibilities.
         * 
         * @param spacing   A description of a range of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibility(spacing: IPossibilitySpacing): number {
            var spacingObject: IPossibilitySpacing = spacing,
                min: number = spacingObject.min,
                max: number = spacingObject.max,
                units: number = spacingObject.units || 1;

            return this.randomBetween(min / units, max / units) * units;
        }

        /**
         * Computes a distance from any description of distance possibilities.
         * 
         * @param spacing   Descriptions of ranges of possibilities for spacing.
         * @returns A valid distance for the given spacing description.
         */
        calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number {
            return this.calculateFromPossibility(this.chooseAmong(spacing).value);
        }
    }
}
