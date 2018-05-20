import { AreaSpawnr } from "areaspawnr";

import { EightBittr } from "../EightBittr";

export const createAreaSpawner = (eightBitter: EightBittr): AreaSpawnr =>
    new AreaSpawnr({
        mapScreenr: eightBitter.mapScreener,
        mapsCreatr: eightBitter.mapsCreator,
        ...eightBitter.settings.components.areas,
    });
