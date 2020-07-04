import { TouchPassr } from "touchpassr";

import { EightBittr } from "../EightBittr";

export const createTouchPasser = (game: EightBittr) =>
    new TouchPassr({
        inputWriter: game.inputWriter,
        parentContainer: game.container,
        ...game.settings.components.touchPasser,
    });
