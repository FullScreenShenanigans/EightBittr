import { IItemsHoldrSettings, ItemsHoldr } from "itemsholdr";

import { AudioPlayr } from "./AudioPlayr";
import { IAudioPlayrSettings } from "./IAudioPlayr";

/**
 * @param settings   Settings for the AudioPlayr.
 * @returns An AudioPlayr instance.
 */
export const stubAudioPlayr = (settings: IAudioPlayrSettings)  =>
    new AudioPlayr(settings);

/**
 * @returns Settings for the AudioPlayr.
 */
export const stubAudioPlayrSettings = (): IAudioPlayrSettings => ({
    directory: "",
    library: {
        Sounds: [
            "Ringtone",
        ],
    },
    fileTypes: ["mp3"],
    itemsHolder: new ItemsHoldr(),
});

/**
 * @param settings   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export const stubItemsHoldr = (settings?: IItemsHoldrSettings) =>
    new ItemsHoldr(settings);

/**
 * Sound name to be used in tests.
 */
export const stubSoundName = "Ringtone";

const delayForAudioRaceConditionMilliseconds = 35;

/**
 * Delays a function to avoid triggering a Webkit-specific race condition.
 *
 * @see http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=593273
 */
export const delayForAudioRaceCondition = async () =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, delayForAudioRaceConditionMilliseconds);
    });
