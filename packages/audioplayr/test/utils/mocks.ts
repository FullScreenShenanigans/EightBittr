/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../../typings/ItemsHoldr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockAudioPlayr: (settings: AudioPlayr.IAudioPlayrSettings = mocks.mockAudioPlayrSettings): AudioPlayr.IAudioPlayr => {
        return new AudioPlayr.AudioPlayr(settings);
    },

    /**
     * 
     */
    mockAudioPlayrSettings: (): AudioPlayr.IAudioPlayrSettings => {
        return {
            directory: "directory",
            library: {},
            fileTypes: ["mp3"],
            ItemsHolder: new ItemsHoldr.ItemsHoldr()
        };
    }
};
