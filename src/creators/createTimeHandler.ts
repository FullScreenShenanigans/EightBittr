import { TimeHandlr } from "timehandlr";

import { EightBittr } from "../EightBittr";

export const createTimeHandler = (eightBitter: EightBittr) =>
    new TimeHandlr({
        timingDefault: eightBitter.timing.timingDefault,
        ...eightBitter.settings.components.timeHandler,
    });
