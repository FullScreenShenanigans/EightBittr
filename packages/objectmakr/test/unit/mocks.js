define(["ObjectMakr"], function (ObjectMakrModule) {
    var ObjectMakr = ObjectMakrModule.ObjectMakr;
    var expect = require("chai").expect;

    var mocks = {
        /**
         * @param [settings]   Settings for the ObjectMakr.
         * @returns An ObjectMakr instance.
         */
        mockObjectMakr: function (settings) {
            return new ObjectMakr(settings || {
                inheritance: {}
            });
        }
    };

    return mocks;
});
