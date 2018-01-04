import { InputWritr } from "inputwritr";

import { GameStartr } from "../gamestartr";

export const createInputWriter = (gameStarter: GameStartr) =>
    new InputWritr({
        canTrigger: (): boolean => gameStarter.gameplay.canInputsTrigger(),
        ...gameStarter.settings.components.input,
    });
