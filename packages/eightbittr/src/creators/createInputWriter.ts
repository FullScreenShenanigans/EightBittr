import { InputWritr } from "inputwritr";

import { GameStartr } from "../GameStartr";

export const createInputWriter = (gameStarter: GameStartr) =>
    new InputWritr({
        canTrigger: (): boolean => gameStarter.gameplay.canInputsTrigger(),
        ...gameStarter.settings.components.input,
    });
