import { IQuadrant, QuadsKeepr } from "quadskeepr";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

export const createQuadsKeeper = (gameStarter: GameStartr) => {
    const quadrantsSettings = gameStarter.settings.components.quadrants || {};
    const quadrantWidth: number = gameStarter.settings.width / 6;
    const quadrantHeight: number = gameStarter.settings.height / 6;

    return new QuadsKeepr<IThing>({
        quadrantFactory: (): IQuadrant<IThing> => gameStarter.objectMaker.make<IQuadrant<IThing>>("Quadrant"),
        quadrantWidth,
        quadrantHeight,
        startLeft: -quadrantWidth,
        startTop: -quadrantHeight,
        onAdd: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            gameStarter.maps.onAreaSpawn(direction, top, right, bottom, left);
        },
        onRemove: (direction: string, top: number, right: number, bottom: number, left: number): void => {
            gameStarter.maps.onAreaUnspawn(direction, top, right, bottom, left);
        },
        ...gameStarter.settings.components.quadrants,
    });
};
