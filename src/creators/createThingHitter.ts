import { ThingHittr } from "thinghittr";

import { GameStartr } from "../GameStartr";

export const createThingHitter = (gameStarter: GameStartr) =>
    new ThingHittr(gameStarter.settings.components.collisions);
