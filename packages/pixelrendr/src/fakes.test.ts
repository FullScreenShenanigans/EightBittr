import { IPixel, IPixelRendrSettings } from "./IPixelRendr";
import { PixelRendr } from "./PixelRendr";

/**
 * Default sprite name in the library.
 */
export const stubSpriteName = "Box";

/**
 * Default palette in the library.
 */
export const stubPalette: IPixel[] = [
    [0, 0, 0, 0],
    [255, 255, 255, 255],
    [0, 0, 0, 255],
    [199, 199, 192, 255],
    [128, 128, 128, 255],
];

/**
 * @returns Settings for a PixelRendr instance.
 */
export const stubPixelRendrSettings = (): IPixelRendrSettings => ({
    paletteDefault: stubPalette,
    library: {
        [stubSpriteName]: "x016,",
    },
});

/**
 * @param settings   Settings for the PixelRendr.
 * @returns A PixelRendr instance.
 */
export const stubPixelRendr = (settings: IPixelRendrSettings = stubPixelRendrSettings()) =>
    new PixelRendr(settings);
