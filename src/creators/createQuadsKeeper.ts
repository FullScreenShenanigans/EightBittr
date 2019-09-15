import { IQuadrant, QuadsKeepr } from "quadskeepr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

export const createQuadsKeeper = (eightBitter: EightBittr) => {
    const quadrantWidth: number = eightBitter.settings.width / 6;
    const quadrantHeight: number = eightBitter.settings.height / 6;

    return new QuadsKeepr<IThing>({
        groupNames: eightBitter.groups.groupNames,
        onAdd: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            eightBitter.maps.onAreaSpawn(direction, top, right, bottom, left);
        },
        onRemove: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            eightBitter.maps.onAreaUnspawn(direction, top, right, bottom, left);
        },
        quadrantFactory: (): IQuadrant<IThing> => eightBitter.objectMaker.make<IQuadrant<IThing>>("Quadrant"),
        quadrantHeight,
        quadrantWidth,
        startLeft: -quadrantWidth,
        startTop: -quadrantHeight,
        ...eightBitter.settings.components.quadsKeeper,
    });
};
