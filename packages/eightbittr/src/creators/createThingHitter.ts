import { ThingHittr } from "thinghittr";

import { EightBittr } from "../EightBittr";

export const createThingHitter = (eightBitter: EightBittr) =>
    new ThingHittr({
        globalCheckGenerator: () => eightBitter.collisions.generateCanThingCollide(),
        hitCallbackGenerators: eightBitter.collisions.hitCallbackGenerators,
        hitCheckGenerators: eightBitter.collisions.hitCheckGenerators,
        ...eightBitter.settings.components.thingHitter,
    });
