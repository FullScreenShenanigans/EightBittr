import { GameStartr } from "../GameStartr";

export const createCanvas = (gameStarter: GameStartr) =>
    gameStarter.utilities.createCanvas(
        gameStarter.settings.width,
        gameStarter.settings.height);
