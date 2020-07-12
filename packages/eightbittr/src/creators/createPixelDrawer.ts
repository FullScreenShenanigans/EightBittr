import { PixelDrawr } from "pixeldrawr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

export const createPixelDrawer = (game: EightBittr) =>
    new PixelDrawr({
        background: game.graphics.background,
        boundingBox: game.mapScreener,
        canvas: game.canvas,
        createCanvas: (width: number, height: number) =>
            game.utilities.createCanvas(width, height),
        generateObjectKey: (thing: IThing) => game.graphics.generateThingKey(thing),
        pixelRender: game.pixelRender,
        spriteCacheCutoff: game.graphics.spriteCacheCutoff,
        thingArrays: game.groups.groupNames.map((groupName) =>
            game.groupHolder.getGroup(groupName)
        ),
        ...game.settings.components.pixelDrawer,
    });
