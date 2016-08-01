/// <reference path="../../lib/GameStartr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockGameStartr: (settings: GameStartr.IGameStartrSettings): GameStartr.GameStartr => {
        return new GameStartr.GameStartr(settings);
    }
};
