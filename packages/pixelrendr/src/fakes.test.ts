import { PixelRendr } from "./PixelRendr";
import { Pixel, PixelRendrSettings } from "./types";

/**
 * Default sprite name in the library.
 */
export const stubSpriteName = "Box";

/**
 * Default palette in the library.
 */
export const stubPalette: Pixel[] = [
    [0, 0, 0, 0],
    [255, 255, 255, 255],
    [0, 0, 0, 255],
    [199, 199, 192, 255],
    [128, 128, 128, 255],
];

/**
 * @returns Settings for a PixelRendr instance.
 */
export const stubPixelRendrSettings = (): PixelRendrSettings => ({
    library: {
        [stubSpriteName]: "x016,",
    },
    paletteDefault: stubPalette,
});

/**
 * @param settings   Settings for the PixelRendr.
 * @returns A PixelRendr instance.
 */
export const stubPixelRendr = (settings: PixelRendrSettings = stubPixelRendrSettings()) =>
    new PixelRendr(settings);
