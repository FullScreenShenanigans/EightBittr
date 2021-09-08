import { CreateSound } from "./Sound";

/**
 * Settings to play a sound.
 */
export interface PlaySettings {
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
export type NameTransform = (name: string) => string;

/**
 * Stores mute and volume status locally.
 */
export interface AudioSettingsStorage {
    getMuted(): boolean | undefined;
    setMuted(value: boolean): void;

    getVolume(): number | undefined;
    setVolume(value: number): void;
}

/**
 * Settings to initialize a new instance of an IAudioPlayr.
 */
export interface AudioPlayrSettings {
    /**
     * Creates a new sound.
     */
    createSound?: CreateSound;

    /**
     * Transforms provided names into file names.
     */
    nameTransform?: NameTransform;

    /**
     * Stores mute and volume status locally.
     */
    storage: AudioSettingsStorage;
}
