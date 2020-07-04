import { PixelRendr } from "pixelrendr";

import { EightBittr } from "../EightBittr";

export const createPixelRender = (game: EightBittr) =>
    new PixelRendr({
        filters: game.graphics.filters,
        flipHoriz: game.graphics.flipHoriz,
        flipVert: game.graphics.flipVert,
        library: game.graphics.library,
        paletteDefault: game.graphics.paletteDefault,
        scale: game.graphics.scale,
        ...game.settings.components.pixelRender,
    });
