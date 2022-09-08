import { RandomizedValue } from "./randomization";

/**
 * Description(s) of how far apart to space possibilities.
 */
export type Spacing = number | PossibilitySpacing | RandomizedValue<PossibilitySpacing>[];

/**
 * Range of possibilities for spacing possibilities apart.
 */
export interface PossibilitySpacing {
    /**
     * Maximum amount for the spacing.
     */
    max: number;

    /**
     * Minimum amount for the spacing.
     */
    min: number;

    /**
     * Number unit to round to, if not 1 (no rounding).
     */
    roundTo?: number;
}
