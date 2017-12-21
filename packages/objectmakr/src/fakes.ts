import { IObjectMakr, IObjectMakrSettings } from "./IObjectMakr";
import { ObjectMakr } from "./ObjectMakr";

/**
 * Creates a new ObjectMakr.
 *
 * @param settings   Settings for the ObjectMakr.
 * @returns A new ObjectMakr instance.
 */
export const stubObjectMakr = (settings?: IObjectMakrSettings): IObjectMakr =>
    new ObjectMakr(settings || {
        inheritance: {},
    });
