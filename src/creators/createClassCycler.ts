import { ClassCyclr } from "classcyclr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

export const createClassCycler = (eightBitter: EightBittr) =>
    new ClassCyclr({
        classAdd: (thing: IThing, className: string): void => {
            eightBitter.graphics.addClass(thing, className);
        },
        classRemove: (thing: IThing, className: string): void => {
            eightBitter.graphics.removeClass(thing, className);
        },
        timeHandler: eightBitter.timeHandler,
        ...eightBitter.settings.components.classCycler,
    });
