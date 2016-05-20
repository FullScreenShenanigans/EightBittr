define(["ThingHittr"], function (ThingHittrModule) {
    var ThingHittr = ThingHittrModule.ThingHittr;

    var mocks = {
        /**
         * 
         */
        mockThingHittr: function (settings) {
            return new ThingHittr(settings)
        }
    };

    return mocks;
});
