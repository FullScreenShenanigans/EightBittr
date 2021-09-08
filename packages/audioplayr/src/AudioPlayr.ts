import { AudioPlayrSettings, AudioSettingsStorage, NameTransform, PlaySettings } from "./types";
import { AudioElementSound, CreateSound, Sound } from "./Sound";

/**
 * Created sounds, keyed by name.
 */
interface Sounds {
    [i: string]: Sound;
}

/**
 * Default name transform, which does nothing.
 *
 * @param name   Provided name to play.
 * @returns The same name.
 */
const defaultNameTransform = (name: string): string => name;

/**
 * Playback for persistent and on-demand sounds and themes.
 */
export class AudioPlayr {
    /**
     * Creates a new sound.
     */
    private readonly createSound: CreateSound;

    /**
     * Transforms a sound name into a file name.
     */
    private readonly nameTransform: NameTransform;

    /**
     * Created sounds, keyed by name.
     */
    private sounds: Sounds = {};

    /**
     * Stores mute and volume status locally.
     */
    private readonly storage: AudioSettingsStorage;

    /**
     * Initializes a new instance of the AudioPlayr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: AudioPlayrSettings) {
        this.createSound = settings.createSound || AudioElementSound.create;
        this.nameTransform = settings.nameTransform || defaultNameTransform;
        this.storage = settings.storage;
    }

    /**
     * Gets whether this is muted.
     *
     * @returns Whether this is muted.
     */
    public getMuted(): boolean {
        return !!this.storage.getMuted();
    }

    /**
     * Gets the global sound volume in [0, 1].
     *
     * @returns Global sound volume in [0, 1].
     */
    public getVolume(): number {
        return this.storage.getVolume() ?? 1;
    }

    /**
     * Sets whether this is muted.
     *
     * @param muted   Whether this is now muted.
     */
    public async setMuted(muted: boolean): Promise<void> {
        this.storage.setMuted(muted);

        await Promise.all(
            Object.keys(this.sounds).map(async (name: string) =>
                this.sounds[name].setGlobalMuted(muted)
            )
        );
    }

    /**
     * Sets the global sound volume in [0, 1].
     *
     * @param volume   New global sound volume in [0, 1].
     */
    public async setVolume(volume: number): Promise<void> {
        if (volume < 0 || volume > 1) {
            throw new Error("Volume must be within [0, 1].");
        }

        this.storage.setVolume(volume);

        await Promise.all(
            Object.keys(this.sounds).map(async (name: string) =>
                this.sounds[name].setGlobalVolume(volume)
            )
        );
    }

    /**
     * Plays a sound.
     *
     * @param name   Name of a sound.
     * @param settings   Any settings for the sound.
     * @returns A Promise for playing the sound.
     */
    public async play(name: string, settings: Partial<PlaySettings> = {}): Promise<void> {
        name = this.nameTransform(name);
        const alias = settings.alias === undefined ? name : this.nameTransform(settings.alias);

        if ({}.hasOwnProperty.call(this.sounds, alias)) {
            await this.sounds[alias].stop();
        }

        const sound = (this.sounds[alias] = this.createSound(name, {
            globalMuted: this.getMuted(),
            globalVolume: this.getVolume(),
            localMuted: settings.muted === undefined ? false : settings.muted,
            localVolume: settings.volume === undefined ? 1 : settings.volume,
            loop: settings.loop === undefined ? false : settings.loop,
        }));

        return sound.play();
    }

    /**
     * Pauses all sounds.
     *
     * @returns A Promise for pausing all sounds.
     */
    public async pauseAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds).map(async (name: string) => this.sounds[name].pause())
        );
    }

    /**
     * Un-pauses (plays) all sounds.
     *
     * @returns A Promise for resuming.
     */
    public async resumeAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds).map(async (name: string) => this.sounds[name].play())
        );
    }

    /**
     * Stops all sounds.
     *
     * @returns A Promise for stopping.
     */
    public async stopAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds).map(async (name: string) => this.sounds[name].stop())
        );

        this.sounds = {};
    }

    /**
     * Checks whether a sound under the alias exists.
     *
     * @param alias   Alias to check under.
     * @param name   Name the sound must have, if not the same as the name.
     * @returns Whether a sound exists under the alias.
     */
    public hasSound(alias: string, name?: string): boolean {
        alias = this.nameTransform(alias);
        if (!{}.hasOwnProperty.call(this.sounds, alias)) {
            return false;
        }

        return name === undefined || this.sounds[alias].name === this.nameTransform(name);
    }
}
