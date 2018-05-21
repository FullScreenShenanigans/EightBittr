import { InputWritr } from "inputwritr";

import { EightBittr } from "../EightBittr";

export const createInputWriter = (eightBitter: EightBittr) =>
    new InputWritr({
        canTrigger: (): boolean => eightBitter.gameplay.canInputsTrigger(),
        ...eightBitter.settings.components.inputWriter,
    });
