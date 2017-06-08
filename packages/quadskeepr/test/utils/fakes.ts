import { IQuadsKeepr, IQuadsKeeprSettings, IThing } from "../../src/IQuadsKeepr";
import { QuadsKeepr } from "../../src/QuadsKeepr";

/**
 *
 */
export function stubQuadsKeepr(settings: IQuadsKeeprSettings<IThing>): IQuadsKeepr<IThing> {
    return new QuadsKeepr(settings);
}
