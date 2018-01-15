import { ModAttachr } from "modattachr";

import { GameStartr } from "../GameStartr";

export const createModAttacher = (gameStarter: GameStartr) =>
    new ModAttachr({
        itemsHolder: gameStarter.itemsHolder,
        transformModName: (name: string): string => `Mods::${name}`,
        ...gameStarter.settings.components.mods,
    });
