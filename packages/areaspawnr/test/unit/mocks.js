define(["AreaSpawnr"], function (AreaSpawnrModule) {
    var AreaSpawnr = AreaSpawnrModule.AreaSpawnr;

    var mocks = {
        /**
         * 
         */
        mockAreaSpawnr: function (settings) {
            return new AreaSpawnr(settings)
        }
    };

    return mocks;
});
