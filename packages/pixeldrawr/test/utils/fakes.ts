import { IPixelDrawr, IPixelDrawrSettings } from "../../src/IPixelDrawr";
import { PixelDrawr } from "../../src/PixelDrawr";

/**
 * 
 */
export function mockPixelDrawr(settings: IPixelDrawrSettings): IPixelDrawr {
    return new PixelDrawr(settings);
}
