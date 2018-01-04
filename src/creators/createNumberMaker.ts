import { NumberMakr } from "numbermakr";

import { GameStartr } from "../gamestartr";

export const createNumberMaker = (gameStarter: GameStartr) =>
    new NumberMakr(gameStarter.settings.components.numbers);
