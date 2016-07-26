/// <reference path="../../lib/PixelRendr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the PixelRendr.
     * @returns An PixelRendr instance.
     */
    mockPixelRendr: (settings?: PixelRendr.IPixelRendrSettings): PixelRendr.IPixelRendr => {
        return new PixelRendr.PixelRendr(settings);
    }
};
