import { PixelDrawr } from "pixeldrawr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

export const createPixelDrawer = (game: EightBittr) =>
    new PixelDrawr({
        background: game.graphics.background,
        boundingBox: game.mapScreener,
        contexts: {
            background: game.utilities.getContext(game.background, false),
            foreground: game.utilities.getContext(game.foreground, true),
        },
        generateObjectKey: (actor: Actor) => game.graphics.generateActorKey(actor),
        pixelRender: game.pixelRender,
        spriteCacheCutoff: game.graphics.spriteCacheCutoff,
        actorArrays: game.groups.groupNames.map((groupName) =>
            game.groupHolder.getGroup(groupName)
        ),
        ...game.settings.components.pixelDrawer,
    });
