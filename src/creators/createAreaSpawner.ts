import { AreaSpawnr } from "areaspawnr";

import { GameStartr } from "../GameStartr";

export const createAreaSpawner = (gameStarter: GameStartr): AreaSpawnr =>
    new AreaSpawnr({
        mapsCreatr: gameStarter.mapsCreator,
        mapScreenr: gameStarter.mapScreener,
        ...gameStarter.settings.components.areas,
    });
