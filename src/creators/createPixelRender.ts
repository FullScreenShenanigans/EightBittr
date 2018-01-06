import { PixelRendr } from "pixelrendr";

import { GameStartr } from "../GameStartr";

export const createPixelRender = (gameStarter: GameStartr) =>
    new PixelRendr(gameStarter.settings.components.sprites);
