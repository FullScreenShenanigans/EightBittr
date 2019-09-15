import { InputWritr } from "inputwritr";

import { EightBittr } from "../EightBittr";

export const createInputWriter = (eightBitter: EightBittr) =>
    new InputWritr({
        aliases: eightBitter.inputs.aliases,
        canTrigger: (): boolean => eightBitter.gameplay.canInputsTrigger(),
        triggers: eightBitter.inputs.triggers,
        ...eightBitter.settings.components.inputWriter,
    });
