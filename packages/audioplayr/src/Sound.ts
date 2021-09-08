/**
 * Settings to create a new sound.
 */
export interface SoundSettings {
    /**
     * Whether all sounds are muted (by default, false).
     */
    globalMuted: boolean;

    /**
     * Initial volume for all sounds (by default, 1).
     */
    globalVolume: number;

    /**
     * Whether this sound is muted (by default, false).
     */
    localMuted: boolean;

    /**
     * Initial volume for this sound (by default, 1).
     */
    localVolume: number;

    /**
     * Whether it should loop (by default, false).
     */
    loop: boolean;
}

/**
 * Creates a new sound.
 *
 * @param name   Name of the sound.
 * @param settings   Any settings for the sound.
 * @returns A new sound.
 */
export type CreateSound = (name: string, settings?: SoundSettings) => Sound;

/**
 * Wrapper for a playing sound.
 */
export interface Sound {
    /**
     * Source name of the sound.
     */
    readonly name: string;

    /**
     * Pauses the sound.
     *
     * @returns A Promise for pausing the sound.
     */
    pause(): Promise<void>;

    /**
     * Plays the sound.
     *
     * @returns A Promise for playing the sound.
     */
    play(): Promise<void>;

    /**
     * Sets a new global muted.
     *
     * @param muted   New global muted.
     * @returns A Promise for setting a new global muted.
     */
    setGlobalMuted(muted: boolean): Promise<void>;

    /**
     * Sets a new global volume in [0, 1].
     *
     * @param volume   New volume in [0, 1]..
     * @returns A Promise for setting a new volume.
     */
    setGlobalVolume(volume: number): Promise<void>;

    /**
     * Sets whether this should loop.
     *
     * @param loop   Whether to loop.
     * @returns A Promise for setting whether this should loop.
     */
    setLoop(loop: boolean): Promise<void>;

    /**
     * Stops the sound.
     *
     * @returns A Promise for stopping the sound.
     */
    stop(): Promise<void>;
}

/**
 * Default sound settings for all sounds.
 */
const defaultSoundSettings: SoundSettings = {
    globalMuted: false,
    globalVolume: 1,
    localMuted: false,
    localVolume: 1,
    loop: false,
};

/**
 * Wraps an <audio> element.
 */
export class AudioElementSound implements Sound {
    /**
     * Source name of the sound.
     */
    public readonly name: string;

    /**
     * Contained <audio> element.
     */
    private readonly element: HTMLAudioElement;

    /**
     * Settings used for the sound.
     */
    private readonly settings: SoundSettings;

    /**
     * Initializes a new instance of the AudioElementSound class.
     *
     * @param name   Name of the sound.
     * @param settings   Any settings for the sound.
     */
    public constructor(name: string, settings: Partial<SoundSettings>) {
        this.name = name;
        this.settings = { ...defaultSoundSettings, ...settings };

        this.element = document.createElement("audio");
        this.element.src = name;
        this.element.loop = this.settings.loop;
        this.element.muted = this.settings.globalMuted || this.settings.localMuted;
        this.element.volume = this.settings.globalVolume * this.settings.localVolume;
    }

    /**
     * Pauses the sound.
     *
     * @returns A Promise for pausing the sound.
     */
    public async pause(): Promise<void> {
        this.element.pause();
    }

    /**
     * Plays the sound.
     *
     * @returns A Promise for playing the sound.
     */
    public async play(): Promise<void> {
        return this.element.play();
    }

    /**
     * Sets whether this should loop.
     *
     * @param loop   Whether to loop.
     * @returns A Promise for setting whether this should loop.
     */
    public async setLoop(loop: boolean): Promise<void> {
        this.element.loop = loop;
    }

    /**
     * Sets whether this is muted.
     *
     * @param muted   Whether this is muted.
     * @returns A Promise for setting whether this is muted.
     */
    public async setGlobalMuted(muted: boolean): Promise<void> {
        this.settings.globalMuted = muted;
        this.element.muted = this.settings.globalMuted || this.settings.localMuted;
    }

    /**
     * Sets a new global volume in [0, 1].
     *
     * @param volume   New volume in [0, 1]..
     * @returns A Promise for setting a new volume.
     */
    public async setGlobalVolume(volume: number): Promise<void> {
        this.settings.globalVolume = volume;
        this.element.volume = this.settings.globalVolume * this.settings.localVolume;
    }

    /**
     * Plays the sound.
     *
     * @returns A Promise for playing the sound.
     */
    public async stop(): Promise<void> {
        await this.pause();
        this.element.currentTime = 0;
    }

    /**
     * Creates a new AudioElementSound.
     *
     * @param name   Name of the sound.
     * @param settings   Any settings for the sound.
     * @returns A new sound.
     */
    public static create = (
        name: string,
        settings: Partial<SoundSettings> = {}
    ): AudioElementSound => new AudioElementSound(name, settings);
}
