import { MapScreenr } from "mapscreenr";

import { GameStartr } from "../GameStartr";

export const createMapScreener = (gameStarter: GameStartr): MapScreenr =>
    new MapScreenr({
        height: gameStarter.settings.height,
        width: gameStarter.settings.width,
        ...gameStarter.settings.components.screen,
    });
