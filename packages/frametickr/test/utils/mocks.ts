/// <reference path="../../lib/GamesRunnr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockGamesRunnr: (settings?: GamesRunnr.IGamesRunnrSettings): GamesRunnr.IGamesRunnr => {
        return new GamesRunnr.GamesRunnr(settings)
    }
};
