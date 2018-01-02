import { ICreateSound } from "./Sound";
import { IAudioSettingsStorage } from "./Storage";

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
    storage?: IAudioSettingsStorage;
}

/**
 * Playback for persistent and on-demand sounds and themes.
 */
export interface IAudioPlayr {
    /**
     * Gets whether this is muted.
     *
     * @returns Whether this is now muted.
     */
    getMuted(): boolean;

    /**
     * Gets the global sound volume in [0, 1].
     *
     * @returns Global sound volume in [0, 1].
     */
    getVolume(): number;

    /**
     * Sets whether this is muted.
     *
     * @param muted   Whether this is now muted.
     */
    setMuted(muted: boolean): Promise<void>;

    /**
     * Sets the global sound volume in [0, 1].
     *
     * @param volume   New global sound volume in [0, 1].
     */
    setVolume(volume: number): Promise<void>;

    /**
     * Plays a sound.
     *
     * @param name   Name of a sound.
     * @param settings   Any settings for the sound.
     * @returns A Promise for playing the sound.
     */
    play(name: string, settings?: IPlaySettings): Promise<void>;

    /**
     * Pauses all sounds.
     *
     * @returns A Promise for pausing all sounds.
     */
    pauseAll(): Promise<void>;

    /**
     * Un-pauses (plays) all sounds.
     *
     * @returns A Promise for resuming.
     */
    resumeAll(): Promise<void>;

    /**
     * Stops all sounds and any theme.
     *
     * @returns A Promise for stopping all sounds.
     */
    stopAll(): Promise<void>;

    /**
     * Checks whether a sound under the alias exists.
     *
     * @param alias   Alias to check under.
     * @param name   Name the sound must have, if not the same as alias.
     * @returns Whether a sound exists under the alias.
     */
    hasSound(alias: string, name?: string): boolean;
}
