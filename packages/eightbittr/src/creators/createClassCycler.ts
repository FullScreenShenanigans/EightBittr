import { ClassCyclr } from "classcyclr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

export const createClassCycler = (game: EightBittr) =>
    new ClassCyclr({
        classAdd: (thing: IThing, className: string): void => {
            game.graphics.classes.addClass(thing, className);
        },
        classRemove: (thing: IThing, className: string): void => {
            game.graphics.classes.removeClass(thing, className);
        },
        timeHandler: game.timeHandler,
        ...game.settings.components.classCycler,
    });
