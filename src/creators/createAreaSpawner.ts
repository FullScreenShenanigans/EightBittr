import { AreaSpawnr } from "areaspawnr";

import { GameStartr } from "../gamestartr";

export const createAreaSpawner = (gameStarter: GameStartr): AreaSpawnr =>
    new AreaSpawnr({
        mapsCreatr: gameStarter.mapsCreator,
        mapScreenr: gameStarter.mapScreener,
        ...gameStarter.settings.components.areas,
    });
