import { PixelDrawr } from "pixeldrawr";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

export const createPixelDrawer = (gameStarter: GameStartr) =>
    new PixelDrawr({
        boundingBox: gameStarter.mapScreener,
        canvas: gameStarter.canvas,
        createCanvas: (width: number, height: number): HTMLCanvasElement =>
        gameStarter.utilities.createCanvas(width, height),
        generateObjectKey: (thing: IThing): string => gameStarter.graphics.generateThingKey(thing),
        pixelRender: gameStarter.pixelRender,
        ...gameStarter.settings.components.drawing,
    });
