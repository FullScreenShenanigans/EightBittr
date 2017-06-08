import { IThingHittr, IThingHittrSettings } from "../../src/IThingHittr";
import { ThingHittr } from "../../src/ThingHittr";

/**
 *
 */
export function mockThingHittr(settings: IThingHittrSettings): IThingHittr {
    return new ThingHittr(settings);
}
