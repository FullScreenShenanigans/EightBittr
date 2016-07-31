/// <reference path="../../lib/AreaSpawnr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockAreaSpawnr: (settings: AreaSpawnr.IAreaSpawnrSettings = mocks.mockAreaSpawnrSettings): AreaSpawnr.IAreaSpawnr => {
        return new AreaSpawnr.AreaSpawnr(settings);
    }
};
