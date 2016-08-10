/// <reference path="../../lib/PixelRendr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the PixelRendr.
     * @returns A PixelRendr instance.
     */
    mockPixelRendr: (settings: PixelRendr.IPixelRendrSettings = mocks.mockPixelRendrSettings()): PixelRendr.IPixelRendr => {
        return new PixelRendr.PixelRendr(settings);
    },
    /**
     * @returns Settings for a PixelRendr instance.
     */
    mockPixelRendrSettings: (): PixelRendr.IPixelRendrSettings => {
        return {
            paletteDefault: [
                [0, 0, 0, 0],
                [255, 255, 255, 255],
                [0, 0, 0, 255],
                [199, 199, 192, 255],
                [128, 128, 128, 255]
            ],
            library: {
                [mocks.mockSpriteName]: "x016,"
            }
        }
    },
    /**
     * @returns The name of the default sprite name in the library.
     */
    mockSpriteName: "Box"
};
