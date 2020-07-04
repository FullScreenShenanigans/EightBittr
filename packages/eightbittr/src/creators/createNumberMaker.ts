import { NumberMakr } from "numbermakr";

import { EightBittr } from "../EightBittr";

export const createNumberMaker = (game: EightBittr) =>
    new NumberMakr(game.settings.components.numberMaker);
