define(["WorldSeedr"], function (WorldSeedrModule) {
    var WorldSeedr = WorldSeedrModule.WorldSeedr;

    var mocks = {
        /**
         * 
         */
        mockWorldSeedr: function (settings) {
            return new WorldSeedr(settings)
        }
    };

    return mocks;
});
