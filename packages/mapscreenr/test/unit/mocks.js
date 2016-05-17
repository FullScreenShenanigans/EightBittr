define(["MapScreenr"], function (MapScreenrModule) {
    var EightBittr = MapScreenrModule.EightBittr;

    var mocks = {
        /**
         * 
         */
        mockMapScreenr: function (settings) {
            return new MapScreenr(settings);
        }
    };

    return mocks;
});
