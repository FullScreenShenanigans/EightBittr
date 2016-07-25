/// <reference path="../../lib/MapsCreatr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockMapsCreatr: (settings?: MapsCreatr.IMapsCreatrSettings): MapsCreatr.IMapsCreatr => {
        return new MapsCreatr.MapsCreatr(settings);
    }
};
