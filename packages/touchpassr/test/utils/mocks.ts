/// <reference path="../../lib/TouchPassr.d.ts" />
/// <reference path="../../typings/ItemsHoldr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockTouchPassr: (settings: TouchPassr.ITouchPassrSettings = mocks.mockTouchPassrSettings): TouchPassr.ITouchPassr => {
        return new TouchPassr.TouchPassr(settings);
    }
};
