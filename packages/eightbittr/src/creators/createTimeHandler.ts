import { TimeHandlr } from "timehandlr";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

export const createTimeHandler = (gameStarter: GameStartr) =>
    new TimeHandlr({
        classAdd: (thing: IThing, className: string): void => {
            gameStarter.graphics.addClass(thing, className);
        },
        classRemove: (thing: IThing, className: string): void => {
            gameStarter.graphics.removeClass(thing, className);
        },
        ...gameStarter.settings.components.events,
    });
