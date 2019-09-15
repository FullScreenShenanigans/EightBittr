import { MapScreenr } from "mapscreenr";

import { EightBittr } from "../EightBittr";

export const createMapScreener = (eightBitter: EightBittr): MapScreenr =>
    new MapScreenr({
        height: eightBitter.settings.height,
        variableFunctions: eightBitter.scrolling.variableFunctions,
        width: eightBitter.settings.width,
        ...eightBitter.settings.components.mapScreener,
    });
