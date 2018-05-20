import { ThingHittr } from "thinghittr";

import { EightBittr } from "../EightBittr";

export const createThingHitter = (eightBitter: EightBittr) =>
    new ThingHittr(eightBitter.settings.components.collisions);
