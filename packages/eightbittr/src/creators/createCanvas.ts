import { EightBittr } from "../EightBittr";

export const createCanvas = (game: EightBittr) =>
    game.utilities.createCanvas(game.settings.width, game.settings.height);
