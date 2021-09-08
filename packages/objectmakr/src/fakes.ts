import { ObjectMakrSettings } from "./types";
import { ObjectMakr } from "./ObjectMakr";

/**
 * Creates a new ObjectMakr.
 *
 * @param settings   Settings for the ObjectMakr.
 * @returns A new ObjectMakr instance.
 */
export const stubObjectMakr = (settings?: ObjectMakrSettings) =>
    new ObjectMakr(
        settings || {
            inheritance: {},
        }
    );
