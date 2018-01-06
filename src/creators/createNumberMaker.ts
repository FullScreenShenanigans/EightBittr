import { NumberMakr } from "numbermakr";

import { GameStartr } from "../GameStartr";

export const createNumberMaker = (gameStarter: GameStartr) =>
    new NumberMakr(gameStarter.settings.components.numbers);
