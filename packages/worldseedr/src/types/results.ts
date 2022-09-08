import { BoundingBox } from "./geometry";

/**
 * Titles of output actors, mapped to properties allowed on that actor.
 */
export type ResultsContainer = Record<string, Record<string, unknown>>;

/**
 * Chosen result of what to generate.
 */
export interface Result {
    /**
     * Bounding box area this result takes up.
     */
    area: BoundingBox;

    /**
     * Any additional properties to provide along with the result.
     */
    properties?: Record<string, unknown>;

    /**
     * External object title to generate.
     */
    title: string;
}
