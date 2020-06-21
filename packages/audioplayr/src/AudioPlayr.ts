import { IAudioPlayr, IAudioPlayrSettings, INameTransform, IPlaySettings } from "./IAudioPlayr";
import { AudioElementSound, ICreateSound, ISound } from "./Sound";
import { AudioSetting, DefaultStorage, IAudioSettingsStorage } from "./Storage";

/**
 * Created sounds, keyed by name.
 */
interface ISounds {
    [i: string]: ISound;
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
export class AudioPlayr implements IAudioPlayr {
    /**
     * Creates a new sound.
     */
    private readonly createSound: ICreateSound;

    /**
     * Transforms a sound name into a file name.
     */
    private readonly nameTransform: INameTransform;

    /**
     * Created sounds, keyed by name.
     */
    private sounds: ISounds = {};

    /**
     * Stores mute and volume status locally.
     */
    private readonly storage: IAudioSettingsStorage;

    /**
     * Initializes a new instance of the AudioPlayr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IAudioPlayrSettings) {
        this.createSound = settings.createSound || AudioElementSound.create;
        this.nameTransform = settings.nameTransform || defaultNameTransform;
        this.storage = settings.storage || new DefaultStorage();
    }

    /**
     * Gets whether this is muted.
     *
     * @returns Whether this is muted.
     */
    public getMuted(): boolean {
        const mutedRaw = this.storage.getItem(AudioSetting.Muted);

        return mutedRaw === undefined || mutedRaw === null
            ? false
            : JSON.parse(mutedRaw);
    }

    /**
     * Gets the global sound volume in [0, 1].
     *
     * @returns Global sound volume in [0, 1].
     */
    public getVolume(): number {
        const volumeRaw = this.storage.getItem(AudioSetting.Volume);

        return volumeRaw === undefined || volumeRaw === null
            ? 1
            : JSON.parse(volumeRaw);
    }

    /**
     * Sets whether this is muted.
     *
     * @param muted   Whether this is now muted.
     */
    public async setMuted(muted: boolean): Promise<void> {
        this.storage.setItem(AudioSetting.Muted, JSON.stringify(muted));

        await Promise.all(
            Object.keys(this.sounds)
                .map(async (name: string) => this.sounds[name].setGlobalMuted(muted)));
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

        this.storage.setItem(AudioSetting.Volume, volume);

        await Promise.all(
            Object.keys(this.sounds)
                .map(async (name: string) => this.sounds[name].setGlobalVolume(volume)));
    }

    /**
     * Plays a sound.
     *
     * @param name   Name of a sound.
     * @param settings   Any settings for the sound.
     * @returns A Promise for playing the sound.
     */
    public async play(name: string, settings: Partial<IPlaySettings> = {}): Promise<void> {
        name = this.nameTransform(name);
        const alias = settings.alias === undefined
            ? name
            : this.nameTransform(settings.alias);

        if ({}.hasOwnProperty.call(this.sounds, alias)) {
            await this.sounds[alias].stop();
        }

        const sound = this.sounds[alias] = this.createSound(
            name,
            {
                globalMuted: this.getMuted(),
                globalVolume: this.getVolume(),
                localMuted: settings.muted === undefined
                    ? false
                    : settings.muted,
                localVolume: settings.volume === undefined
                    ? 1
                    : settings.volume,
                loop: settings.loop === undefined
                    ? false
                    : settings.loop,
            });

        return sound.play();
    }

    /**
     * Pauses all sounds.
     *
     * @returns A Promise for pausing all sounds.
     */
    public async pauseAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds)
                .map(async (name: string) => this.sounds[name].pause()));
    }

    /**
     * Un-pauses (plays) all sounds.
     *
     * @returns A Promise for resuming.
     */
    public async resumeAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds)
                .map(async (name: string) => this.sounds[name].play()));
    }

    /**
     * Stops all sounds.
     *
     * @returns A Promise for stopping.
     */
    public async stopAll(): Promise<void> {
        await Promise.all(
            Object.keys(this.sounds)
                .map(async (name: string) => this.sounds[name].stop()));

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
