import { MapScreenr } from "mapscreenr";

import { EightBittr } from "../EightBittr";

export const createMapScreener = (game: EightBittr): MapScreenr =>
    new MapScreenr({
        height: game.settings.height,
        variableFunctions: game.scrolling.variableFunctions,
        width: game.settings.width,
        ...game.settings.components.mapScreener,
    });
