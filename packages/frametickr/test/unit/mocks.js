define(["GamesRunnr"], function (GamesRunnrModule) {
    var GamesRunnr = GamesRunnrModule.GamesRunnr;

    var mocks = {
        /**
         * 
         */
        mockGamesRunnr: function (settings) {
            return new GamesRunnr(settings)
        }
    };

    return mocks;
});
