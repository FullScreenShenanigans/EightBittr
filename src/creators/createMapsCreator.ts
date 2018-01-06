import { MapsCreatr } from "mapscreatr";

import { GameStartr } from "../GameStartr";

export const createMapsCreator = (gameStarter: GameStartr): MapsCreatr =>
    new MapsCreatr({
        objectMaker: gameStarter.objectMaker,
        ...gameStarter.settings.components.maps,
    });
