import { PixelRendr } from "pixelrendr";

import { GameStartr } from "../gamestartr";

export const createPixelRender = (gameStarter: GameStartr) =>
    new PixelRendr(gameStarter.settings.components.sprites);
