import { AreaSpawnr } from "areaspawnr";

import { EightBittr } from "../EightBittr";

export const createAreaSpawner = (eightBitter: EightBittr): AreaSpawnr =>
    new AreaSpawnr({
        afterAdd: eightBitter.maps.addAfter,
        mapScreenr: eightBitter.mapScreener,
        mapsCreatr: eightBitter.mapsCreator,
        onSpawn: eightBitter.maps.addPreThing,
        screenAttributes: eightBitter.maps.screenAttributes,
        ...eightBitter.settings.components.areaSpawner,
    });
