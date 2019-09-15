import { ModAttachr } from "modattachr";

import { EightBittr } from "../EightBittr";

export const createModAttacher = (eightBitter: EightBittr) =>
    new ModAttachr({
        itemsHolder: eightBitter.itemsHolder,
        mods: eightBitter.mods.mods,
        transformModName: (name: string): string => `Mods::${name}`,
        ...eightBitter.settings.components.modAttacher,
    });
