import { TimeHandlr } from "timehandlr";

import { EightBittr } from "../EightBittr";

export const createTimeHandler = (eightBitter: EightBittr) =>
    new TimeHandlr(eightBitter.settings.components.timeHandler);
