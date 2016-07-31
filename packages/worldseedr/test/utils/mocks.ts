/// <reference path="../../lib/WorldSeedr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockWorldSeedr: (settings: WorldSeedr.IWorldSeedrSettings): WorldSeedr.IWorldSeedr => {
        return new WorldSeedr.WorldSeedr(settings);
    }
};
