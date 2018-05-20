import { PixelRendr } from "pixelrendr";

import { EightBittr } from "../EightBittr";

export const createPixelRender = (eightBitter: EightBittr) =>
    new PixelRendr(eightBitter.settings.components.sprites);
