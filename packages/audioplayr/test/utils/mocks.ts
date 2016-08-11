/// <reference path="../../lib/AudioPlayr.d.ts" />
/// <reference path="../../typings/ItemsHoldr.d.ts" />

const mocks = {
    /**
     * @param [settings]   Settings for the AudioPlayr.
     * @returns An AudioPlayr instance.
     */
    mockAudioPlayr: (settings: AudioPlayr.IAudioPlayrSettings = mocks.mockAudioPlayrSettings()): AudioPlayr.IAudioPlayr => {
        return new AudioPlayr.AudioPlayr(settings);
    },

    /**
     * @returns   Settings for the AudioPlayr.
     */
    mockAudioPlayrSettings: (): AudioPlayr.IAudioPlayrSettings => {
        return {
            directory: "Sounds",
            library: {
                "Sounds": [
                    "Ringtone"
                ]
            },
            fileTypes: ["mp3"],
            ItemsHolder: new ItemsHoldr.ItemsHoldr()
        };
    },

    /**
     * @param [settings]   Settings for the ItemsHoldr.
     * @returns An ItemsHoldr instance.
     */
    mockItemsHoldr: (settings: ItemsHoldr.IItemsHoldrSettings): ItemsHoldr.IItemsHoldr => {
        return new ItemsHoldr.ItemsHoldr(settings);
    },

    /**
     * The name of the sound to be used in tests.
     */
    mockSoundName: "Ringtone"
};
