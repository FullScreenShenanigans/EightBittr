import { PixelDrawr } from "pixeldrawr";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

export const createPixelDrawer = (gameStarter: GameStartr) =>
    new PixelDrawr({
        pixelRender: gameStarter.pixelRender,
        boundingBox: gameStarter.mapScreener,
        canvas: gameStarter.canvas,
        createCanvas: (width: number, height: number): HTMLCanvasElement =>
            gameStarter.utilities.createCanvas(width, height),
        generateObjectKey: (thing: IThing): string => gameStarter.graphics.generateThingKey(thing),
        ...gameStarter.settings.components.drawing,
    });
