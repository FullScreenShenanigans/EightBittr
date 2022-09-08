import { PossibilitiesContainer } from "./types/possibilities";
import { RandomNumberGenerator } from "./types/randomization";

export * from "./types/geometry";
export * from "./types/possibilities";
export * from "./types/randomization";
export * from "./types/results";
export * from "./types/spacing";

/**
 * Settings to initialize a new WorldSeedr.
 */
export interface WorldSeedrSettings {
    /**
     * Possibilities that may be placed, keyed by title.
     */
    possibilities: PossibilitiesContainer;

    /**
     * Function used to generate a random number, if not Math.random.
     */
    random?: RandomNumberGenerator;
}
