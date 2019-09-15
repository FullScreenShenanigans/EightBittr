import { ThingHittr } from "thinghittr";

import { EightBittr } from "../EightBittr";

export const createThingHitter = (eightBitter: EightBittr) =>
    new ThingHittr({
        globalCheckGenerators: eightBitter.collisions.globalCheckGenerators,
        hitCallbackGenerators: eightBitter.collisions.hitCallbackGenerators,
        hitCheckGenerators: eightBitter.collisions.hitCheckGenerators,
        ...eightBitter.settings.components.thingHitter,
    });
