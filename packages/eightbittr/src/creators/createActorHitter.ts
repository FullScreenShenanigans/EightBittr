import { ActorHittr } from "actorhittr";

import { EightBittr } from "../EightBittr";

export const createActorHitter = (game: EightBittr) =>
    new ActorHittr({
        globalCheckGenerator: () => game.collisions.generateCanActorCollide(),
        hitCallbackGenerators: game.collisions.hitCallbackGenerators,
        hitCheckGenerators: game.collisions.hitCheckGenerators,
        ...game.settings.components.actorHitter,
    });
