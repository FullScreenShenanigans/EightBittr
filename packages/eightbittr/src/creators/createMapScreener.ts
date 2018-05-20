import { MapScreenr } from "mapscreenr";

import { EightBittr } from "../EightBittr";

export const createMapScreener = (eightBitter: EightBittr): MapScreenr =>
    new MapScreenr({
        height: eightBitter.settings.height,
        width: eightBitter.settings.width,
        ...eightBitter.settings.components.screen,
    });
