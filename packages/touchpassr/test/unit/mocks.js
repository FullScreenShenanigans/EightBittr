define(["TouchPassr"], function (TouchPassrModule) {
    var TouchPassr = TouchPassrModule.TouchPassr;

    var mocks = {
        /**
         * 
         */
        mockTouchPassr: function (settings) {
            return new TouchPassr(settings)
        }
    };

    return mocks;
});
