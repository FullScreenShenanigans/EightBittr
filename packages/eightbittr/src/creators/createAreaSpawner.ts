import { AreaSpawnr } from "areaspawnr";

import { EightBittr } from "../EightBittr";

export const createAreaSpawner = (game: EightBittr): AreaSpawnr =>
    new AreaSpawnr({
        afterAdd: game.maps.addAfter,
        mapScreenr: game.mapScreener,
        mapsCreatr: game.mapsCreator,
        onSpawn: game.maps.addPreThing,
        screenAttributes: game.maps.screenAttributes,
        ...game.settings.components.areaSpawner,
    });
