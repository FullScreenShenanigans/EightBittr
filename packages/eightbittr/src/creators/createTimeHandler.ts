import { TimeHandlr } from "timehandlr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

export const createTimeHandler = (eightBitter: EightBittr) =>
    new TimeHandlr({
        classAdd: (thing: IThing, className: string): void => {
            eightBitter.graphics.addClass(thing, className);
        },
        classRemove: (thing: IThing, className: string): void => {
            eightBitter.graphics.removeClass(thing, className);
        },
        ...eightBitter.settings.components.events,
    });
