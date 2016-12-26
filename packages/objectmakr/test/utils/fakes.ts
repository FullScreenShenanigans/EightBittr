import { IObjectMakr, IObjectMakrSettings } from "../../src/IObjectMakr";
import { ObjectMakr } from "../../src/ObjectMakr";

export const fakes = {
    /**
     * @param settings   Settings for the ObjectMakr.
     * @returns A new ObjectMakr instance.
     */
    stubObjectMakr: function (settings?: IObjectMakrSettings): IObjectMakr {
        return new ObjectMakr(settings || {
            inheritance: {}
        });
    }
};
