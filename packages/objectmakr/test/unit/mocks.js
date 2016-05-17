define(["ObjectMakr"], function (ObjectMakrModule) {
    var ObjectMakr = ObjectMakrModule.ObjectMakr;

    var mocks = {
        /**
         * 
         */
        mockObjectMakr: function (settings) {
            return new ObjectMakr(unitsize)
        }
    };

    return mocks;
});
