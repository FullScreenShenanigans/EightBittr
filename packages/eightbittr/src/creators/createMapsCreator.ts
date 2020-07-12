import { MapsCreatr } from "mapscreatr";

import { EightBittr } from "../EightBittr";

export const createMapsCreator = (game: EightBittr): MapsCreatr =>
    new MapsCreatr({
        entrances: game.maps.entrances,
        groupTypes: game.groups.groupNames,
        macros: game.maps.macros,
        maps: game.maps.maps,
        objectMaker: game.objectMaker,
        ...game.settings.components.mapsCreator,
    });
