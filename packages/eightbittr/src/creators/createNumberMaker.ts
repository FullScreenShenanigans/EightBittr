import { NumberMakr } from "numbermakr";

import { EightBittr } from "../EightBittr";

export const createNumberMaker = (eightBitter: EightBittr) =>
    new NumberMakr(eightBitter.settings.components.numbers);
