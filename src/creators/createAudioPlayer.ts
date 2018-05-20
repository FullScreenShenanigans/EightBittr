import { AudioPlayr } from "audioplayr";

import { EightBittr } from "../EightBittr";

export const createAudioPlayer = (eightBitter: EightBittr) =>
    new AudioPlayr({
        storage: eightBitter.itemsHolder,
        ...eightBitter.settings.components.audio,
    });
