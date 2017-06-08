import { IItemsHoldr, IItemsHoldrSettings } from "itemsholdr/lib/IItemsHoldr";
import { ItemsHoldr } from "itemsholdr/lib/ItemsHoldr";

import { AudioPlayr } from "../../src/AudioPlayr";
import { IAudioPlayr, IAudioPlayrSettings } from "../../src/IAudioPlayr";

/**
 * @param settings   Settings for the AudioPlayr.
 * @returns An AudioPlayr instance.
 */
export function stubAudioPlayr(settings: IAudioPlayrSettings): IAudioPlayr {
    return new AudioPlayr(settings);
}

/**
 * @returns Settings for the AudioPlayr.
 */
export function stubAudioPlayrSettings(): IAudioPlayrSettings {
    return {
        directory: "Sounds",
        library: {
            "Sounds": [
                "Ringtone"
            ]
        },
        fileTypes: ["mp3"],
        itemsHolder: new ItemsHoldr()
    };
}

/**
 * @param settings   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export function stubItemsHoldr(settings?: IItemsHoldrSettings): IItemsHoldr {
    return new ItemsHoldr(settings);
}

/**
 * Sound name to be used in tests.
 */
export const stubSoundName: string = "Ringtone";

/* tslint:disable max-line-length */
/**
 * Delays a function to avoid triggering a Webkit-specific race condition.
 *
 * @param function   Function to delay.
 * @see http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=593273
 */
export function delayForAudioRaceCondition(callback: () => void): void {
    setTimeout(callback, 35);
}
/* tslint:enable max-line-length */
