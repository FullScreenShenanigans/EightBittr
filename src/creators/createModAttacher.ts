import { ModAttachr } from "modattachr";

import { GameStartr } from "../gamestartr";

export const createModAttacher = (gameStarter: GameStartr) =>
    new ModAttachr({
        itemsHolder: gameStarter.itemsHolder,
        storeLocally: true,
        transformModName: (name: string): string => `${gameStarter.itemsHolder.getPrefix()}::Mods::${name}`,
        ...gameStarter.settings.components.mods,
    });
