/// <reference path="../../lib/ThingHittr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockThingHittr: (settings: ThingHittr.IThingHittrSettings): ThingHittr.IThingHittr => {
        return new ThingHittr.ThingHittr(settings);
    }
};
