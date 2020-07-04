import { TimeHandlr } from "timehandlr";

import { EightBittr } from "../EightBittr";

export const createTimeHandler = (game: EightBittr) =>
    new TimeHandlr({
        timingDefault: game.timing.timingDefault,
        ...game.settings.components.timeHandler,
    });
