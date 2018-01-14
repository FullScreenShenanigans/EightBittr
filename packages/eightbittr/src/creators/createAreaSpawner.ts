import { AreaSpawnr } from "areaspawnr";

import { GameStartr } from "../GameStartr";

export const createAreaSpawner = (gameStarter: GameStartr): AreaSpawnr =>
    new AreaSpawnr({
        mapScreenr: gameStarter.mapScreener,
        mapsCreatr: gameStarter.mapsCreator,
        ...gameStarter.settings.components.areas,
    });
