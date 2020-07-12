import * as sinon from "sinon";

import { AudioPlayr } from "./AudioPlayr";
import { IAudioPlayrSettings } from "./types";
import { AudioElementSound, ISound } from "./Sound";

const createStubStorage = () => {
    let muted = false;
    let volume = 1;

    return {
        getMuted: () => muted,
        getVolume: () => volume,
        setMuted: (value: boolean) => (muted = value),
        setVolume: (value: number) => (volume = value),
    };
};

export const stubAudioPlayr = (settings: Partial<IAudioPlayrSettings> = {}) => {
    const createdSounds: {
        [i: string]: sinon.SinonStubbedInstance<ISound>;
    } = {};
    const createSound = sinon.spy(
        (name: string) => (createdSounds[name] = sinon.createStubInstance(AudioElementSound))
    );

    const getCreatedSound = (name: string) => {
        if (settings.nameTransform) {
            name = settings.nameTransform(name);
        }

        return createdSounds[name];
    };

    const storage = createStubStorage();
    const audioPlayer = new AudioPlayr({
        createSound,
        storage,
        ...settings,
    });

    return { audioPlayer, createSound, getCreatedSound, storage };
};
