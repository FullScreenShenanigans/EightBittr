// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { AudioPlayr } from "audioplayr";

import { EightBittr } from "../EightBittr";

export const createAudioPlayer = (game: EightBittr) =>
    new AudioPlayr({
        nameTransform: game.audio.nameTransform,
        storage: game.itemsHolder,
        ...game.settings.components.audioPlayer,
    });
