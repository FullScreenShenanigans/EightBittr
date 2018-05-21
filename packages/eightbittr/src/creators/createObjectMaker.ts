import { ObjectMakr } from "objectmakr";

import { EightBittr } from "../EightBittr";

export const createObjectMaker = (eightBitter: EightBittr) =>
    new ObjectMakr(eightBitter.settings.components.objectMaker);
