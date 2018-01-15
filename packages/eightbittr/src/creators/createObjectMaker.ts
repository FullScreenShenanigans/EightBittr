import { ObjectMakr } from "objectmakr";

import { GameStartr } from "../GameStartr";

export const createObjectMaker = (gameStarter: GameStartr) =>
    new ObjectMakr(gameStarter.settings.components.objects);
