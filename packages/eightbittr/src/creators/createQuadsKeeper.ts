import { QuadsKeepr } from "quadskeepr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

export const createQuadsKeeper = (game: EightBittr) => {
    const numCols = game.quadrants.numCols || 2;
    const numRows = game.quadrants.numCols || 2;
    const quadrantHeight = game.quadrants.quadrantHeight || game.settings.height / numCols;
    const quadrantWidth = game.quadrants.quadrantWidth || game.settings.width / numRows;

    return new QuadsKeepr<Actor>({
        groupNames: game.quadrants.activeGroupNames,
        numCols,
        numRows,
        onAdd: game.maps.onAreaSpawn.bind(game.maps),
        onRemove: game.maps.onAreaUnspawn.bind(game.maps),
        quadrantHeight,
        quadrantWidth,
        startLeft: -quadrantWidth,
        startTop: -quadrantHeight,
        ...game.settings.components.quadsKeeper,
    });
};
