import { InputWritr } from "inputwritr";

import { EightBittr } from "../EightBittr";

export const createInputWriter = (game: EightBittr) =>
    new InputWritr({
        aliases: game.inputs.aliases,
        canTrigger: (): boolean => game.gameplay.canInputsTrigger(),
        triggers: game.inputs.triggers,
        ...game.settings.components.inputWriter,
    });
