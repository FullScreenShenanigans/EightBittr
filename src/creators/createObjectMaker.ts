import { ObjectMakr } from "objectmakr";

import { GameStartr } from "../gamestartr";

export const createObjectMaker = (gameStarter: GameStartr) =>
    new ObjectMakr({
        doPropertiesFull: true,
        ...gameStarter.settings.components.objects,
    });
