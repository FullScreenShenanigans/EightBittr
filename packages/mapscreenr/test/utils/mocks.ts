/// <reference path="../../lib/MapScreenr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockMapScreenr: (settings?: MapScreenr.IMapScreenrSettings): MapScreenr.IMapScreenr => {
        return new MapScreenr.MapScreenr(settings);
    }
};
