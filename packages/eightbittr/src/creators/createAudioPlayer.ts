// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { AudioPlayr } from "audioplayr";

import { EightBittr } from "../EightBittr";

export const createAudioPlayer = (eightBitter: EightBittr) =>
    new AudioPlayr({
        nameTransform: eightBitter.audio.nameTransform,
        storage: eightBitter.itemsHolder,
        ...eightBitter.settings.components.audioPlayer,
    });
