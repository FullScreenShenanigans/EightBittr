/// <reference path="../../lib/PixelDrawr.d.ts" />
/// <reference path="../../typings/ItemsHoldr.d.ts" />
/// <reference path="../../typings/ObjectMakr.d.ts" />
/// <reference path="../../typings/PixelRendr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockPixelDrawr: (settings: PixelDrawr.IPixelDrawrSettings = mocks.mockPixelDrawrSettings): PixelDrawr.IPixelDrawr => {
        return new PixelDrawr.PixelDrawr(settings);
    }
};
