import * as sinon from "sinon";

import { AudioPlayr } from "./AudioPlayr";
import { IAudioPlayrSettings } from "./IAudioPlayr";
import { AudioElementSound, ISound } from "./Sound";
import { DefaultStorage } from "./Storage";

export const stubAudioPlayr = (settings: IAudioPlayrSettings = {}) => {
    const createdSounds: {
        [i: string]: sinon.SinonStubbedInstance<ISound>;
    } = {};
    const createSound = sinon.spy(
        (name: string) =>
            (createdSounds[name] = sinon.createStubInstance(AudioElementSound))
    );

    const getCreatedSound = (name: string) => {
        if (settings.nameTransform) {
            name = settings.nameTransform(name);
        }

        return createdSounds[name];
    };

    const storage = new DefaultStorage();
    const audioPlayer = new AudioPlayr({
        createSound,
        storage,
        ...settings,
    });

    return { audioPlayer, createSound, getCreatedSound, storage };
};
