import { MapsCreatr } from "mapscreatr";

import { GameStartr } from "../gamestartr";

export const createMapsCreator = (gameStarter: GameStartr) =>
    new MapsCreatr({
        objectMaker: gameStarter.objectMaker,
        ...gameStarter.settings.components.maps,
    });
