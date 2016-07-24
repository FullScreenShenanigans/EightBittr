/// <reference path="../../lib/ObjectMakr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the ObjectMakr.
     * @returns A new ObjectMakr instance.
     */
    mockObjectMakr: function (settings?: ObjectMakr.IObjectMakrSettings): ObjectMakr.IObjectMakr {
        return new ObjectMakr.ObjectMakr(settings || {
            inheritance: {}
        });
    }
};
