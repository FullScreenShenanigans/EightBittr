import { ICreateSound } from "./Sound";

/**
 * Settings to play a sound.
 */
export interface IPlaySettings {
    /**
     * Alias to store this under (by default, its name).
     */
    alias?: string;

    /**
     * Whether it should loop (by default, false).
     */
    loop?: boolean;

    /**
     * Whether this sound is muted (by default, false).
     */
    muted?: boolean;

    /**
     * Initial volume for this sound (by default, 1).
     */
    volume?: number;
}

/**
 * Transforms a sound name into a file name.
 *
 * @param name   Provided name to play.
 * @returns Equivalent file name.
 */
export type INameTransform = (name: string) => string;

/**
 * Stores mute and volume status locally.
 */
export interface IAudioSettingsStorage {
    getMuted(): boolean | undefined;
    setMuted(value: boolean): void;

    getVolume(): number | undefined;
    setVolume(value: number): void;
}

/**
 * Settings to initialize a new instance of an IAudioPlayr.
 */
export interface IAudioPlayrSettings {
    /**
     * Creates a new sound.
     */
    createSound?: ICreateSound;

    /**
     * Transforms provided names into file names.
     */
    nameTransform?: INameTransform;

    /**
     * Stores mute and volume status locally.
     */
    storage: IAudioSettingsStorage;
}
