import { TouchPassr } from "touchpassr";

import { EightBittr } from "../EightBittr";

export const createTouchPasser = (eightBitter: EightBittr) =>
    new TouchPassr({
        inputWriter: eightBitter.inputWriter,
        parentContainer: eightBitter.container,
        ...eightBitter.settings.components.touchPasser,
    });
