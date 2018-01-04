import { TouchPassr } from "touchpassr";

import { GameStartr } from "../GameStartr";

export const createTouchPasser = (gameStarter: GameStartr) =>
    new TouchPassr({
        inputWriter: gameStarter.inputWriter,
        parentContainer: gameStarter.container,
        ...gameStarter.settings.components.touch,
    });
