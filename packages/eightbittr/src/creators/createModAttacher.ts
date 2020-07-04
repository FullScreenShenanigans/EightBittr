import { ModAttachr } from "modattachr";

import { EightBittr } from "../EightBittr";

export const createModAttacher = (game: EightBittr) =>
    new ModAttachr({
        itemsHolder: game.itemsHolder,
        mods: game.mods.mods,
        transformModName: (name: string): string => `Mods::${name}`,
        ...game.settings.components.modAttacher,
    });
