/**
 * Keys for stored audio settings.
 */
export enum AudioSetting {
    /**
     * Key for whether sounds are muted.
     */
    Muted = "muted",

    /**
     * Key for global sound volume.
     */
    Volume = "volume",
}

/**
 * Stores mute and volume status locally.
 */
export interface IAudioSettingsStorage {
    /**
     * Gets a stored value.
     *
     * @param name   Name of the value.
     * @returns Stored value, if it exists.
     */
    getItem(name: AudioSetting): string | null | undefined;

    /**
     * Sets a stored value.
     *
     * @param name   Name of the value.
     * @param value   New value under the name.
     */
    setItem(name: AudioSetting, value: boolean | number | string): void;
}

/**
 * Default, transient storage.
 */
export class DefaultStorage implements IAudioSettingsStorage {
    /**
     * Stored values.
     */
    private readonly values: { [i: string]: string | undefined } = {};

    /**
     * Gets a stored value.
     *
     * @param name   Name of the value.
     * @returns Stored value, if it exists.
     */
    public getItem(name: AudioSetting): string | undefined {
        return this.values[name];
    }

    /**
     * Sets a stored value.
     *
     * @param name   Name of the value.
     * @param value   New value under the name.
     */
    public setItem(name: AudioSetting, value: string): void {
        this.values[name] = value;
    }
}
