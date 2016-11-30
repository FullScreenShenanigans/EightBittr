import { IPixel, IPixelRendr, IPixelRendrSettings } from "../../src/IPixelRendr";
import { PixelRendr } from "../../src/PixelRendr";

/**
 * @param settings   Settings for the PixelRendr.
 * @returns A PixelRendr instance.
 */
export function stubPixelRendr(settings: IPixelRendrSettings = stubPixelRendrSettings()): IPixelRendr {
    return new PixelRendr(settings);
}

/**
 * @returns Settings for a PixelRendr instance.
 */
export function stubPixelRendrSettings(): IPixelRendrSettings {
    return {
        paletteDefault: stubPalette,
        library: {
            [stubSpriteName]: "x016,"
        }
    }
}

/**
 * Default sprite name in the library.
 */
export const stubSpriteName: string = "Box";

/**
 * Default palette in the library.
 */
export const stubPalette: IPixel[] = [
    [0, 0, 0, 0],
    [255, 255, 255, 255],
    [0, 0, 0, 255],
    [199, 199, 192, 255],
    [128, 128, 128, 255]
];
