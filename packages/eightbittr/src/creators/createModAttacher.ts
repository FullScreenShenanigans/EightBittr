import { ModAttachr } from "modattachr";

import { EightBittr } from "../EightBittr";

export const createModAttacher = (eightBitter: EightBittr) =>
    new ModAttachr({
        itemsHolder: eightBitter.itemsHolder,
        transformModName: (name: string): string => `Mods::${name}`,
        ...eightBitter.settings.components.mods,
    });
