define(["MapsCreatr"], function (MapsCreatrModule) {
    var MapsCreatr = MapsCreatrModule.MapsCreatr;

    var mocks = {
        /**
         * 
         */
        mockMapsCreatr: function (settings) {
            return new MapsCreatr(settings)
        }
    };

    return mocks;
});
