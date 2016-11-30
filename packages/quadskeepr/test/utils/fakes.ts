import { QuadsKeepr } from "../../src/QuadsKeepr";
import { IQuadsKeepr, IQuadsKeeprSettings, IThing } from "../../src/IQuadsKeepr";

/**
 * 
 */
export function stubQuadsKeepr(settings: IQuadsKeeprSettings): IQuadsKeepr<IThing> {
    return new QuadsKeepr(settings);
}
