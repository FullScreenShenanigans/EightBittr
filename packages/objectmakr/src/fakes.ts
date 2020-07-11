import { IObjectMakrSettings } from "./types";
import { ObjectMakr } from "./ObjectMakr";

/**
 * Creates a new ObjectMakr.
 *
 * @param settings   Settings for the ObjectMakr.
 * @returns A new ObjectMakr instance.
 */
export const stubObjectMakr = (settings?: IObjectMakrSettings) =>
    new ObjectMakr(
        settings || {
            inheritance: {},
        }
    );
