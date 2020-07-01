import { QuadsKeepr } from "quadskeepr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

export const createQuadsKeeper = (eightBitter: EightBittr) => {
    const numCols = eightBitter.quadrants.numCols || 2;
    const numRows = eightBitter.quadrants.numCols || 2;
    const quadrantHeight =
        eightBitter.quadrants.quadrantHeight || eightBitter.settings.height / numCols;
    const quadrantWidth =
        eightBitter.quadrants.quadrantWidth || eightBitter.settings.width / numRows;

    return new QuadsKeepr<IThing>({
        groupNames: eightBitter.groups.groupNames,
        numCols,
        numRows,
        onAdd: eightBitter.maps.onAreaSpawn.bind(eightBitter.maps),
        onRemove: eightBitter.maps.onAreaUnspawn.bind(eightBitter.maps),
        quadrantHeight,
        quadrantWidth,
        startLeft: -quadrantWidth,
        startTop: -quadrantHeight,
        ...eightBitter.settings.components.quadsKeeper,
    });
};
