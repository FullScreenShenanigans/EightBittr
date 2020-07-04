import { ThingHittr } from "thinghittr";

import { EightBittr } from "../EightBittr";

export const createThingHitter = (game: EightBittr) =>
    new ThingHittr({
        globalCheckGenerator: () => game.collisions.generateCanThingCollide(),
        hitCallbackGenerators: game.collisions.hitCallbackGenerators,
        hitCheckGenerators: game.collisions.hitCheckGenerators,
        ...game.settings.components.thingHitter,
    });
