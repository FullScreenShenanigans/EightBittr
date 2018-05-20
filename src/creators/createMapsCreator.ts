import { MapsCreatr } from "mapscreatr";

import { EightBittr } from "../EightBittr";

export const createMapsCreator = (eightBitter: EightBittr): MapsCreatr =>
    new MapsCreatr({
        objectMaker: eightBitter.objectMaker,
        ...eightBitter.settings.components.maps,
    });
