import { MapsCreatr } from "mapscreatr";

import { EightBittr } from "../EightBittr";

export const createMapsCreator = (eightBitter: EightBittr): MapsCreatr =>
    new MapsCreatr({
        entrances: eightBitter.maps.entrances,
        groupTypes: eightBitter.groups.groupNames,
        macros: eightBitter.maps.macros,
        maps: eightBitter.maps.maps,
        objectMaker: eightBitter.objectMaker,
        ...eightBitter.settings.components.mapsCreator,
    });
