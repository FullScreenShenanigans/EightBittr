import { PixelRendr } from "pixelrendr";

import { EightBittr } from "../EightBittr";

export const createPixelRender = (eightBitter: EightBittr) =>
    new PixelRendr({
        filters: eightBitter.graphics.filters,
        flipHoriz: eightBitter.graphics.flipHoriz,
        flipVert: eightBitter.graphics.flipVert,
        library: eightBitter.graphics.library,
        paletteDefault: eightBitter.graphics.paletteDefault,
        scale: eightBitter.graphics.scale,
        ...eightBitter.settings.components.pixelRender,
    });
