import { TimeHandlr } from "timehandlr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

export const createTimeHandler = (eightBitter: EightBittr) =>
    new TimeHandlr(eightBitter.settings.components.timeHandler);
