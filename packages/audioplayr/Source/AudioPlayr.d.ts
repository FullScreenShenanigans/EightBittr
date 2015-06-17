declare module AudioPlayr {
    export interface IAudioPlayrSettings {
        /**
         * The names of the audio files to be preloaded for on-demand playback.
         */
        library: {
            [i: string]: {
                [i: string]: string;
            }
        };

        /**
         * The directory in which all sub-directories of audio files are stored.
         */
        directory: string;

        /**
         * The allowed filetypes for each audio file. Each of these should have a
         * directory of their name under the main directory, which should contain
         * each file of the filetype.
         */
        fileTypes: string[];

        /**
         * A storage container to store mute/volume status locally. This can be
         * either a ItemsHoldr or localStorage equivalent.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr | Storage;

        /**
         * A String or Function to get the default theme for playTheme calls. 
         * Functions are called for a return value, and Strings are constant
         * (defaults to "Theme").
         * 
         */
        getThemeDefault?: string | { (...args: any[]): string };

        /**
         * A Number or Function to get the "local" volume for playLocal calls. 
         * Functions are called for a return value, and Numbers are constant 
         * (defaults to 1).
         * 
         */
        getVolumeLocal?: number | { (...args: any[]): number };
    }

    export interface IAudioPlayr {
        getLibrary(): any;
        getFileTypes(): string[];
        getSounds(): any;
        getTheme(): HTMLAudioElement;
        getDirectory(): string;
        getVolume(): number;
        setVolume(volume: number): void;
        getMuted(): boolean;
        setMuted(muted: boolean): void;
        toggleMuted(): void;
        setMutedOn(): void;
        setMutedOff(): void;
        getGetVolumeLocal(): any;
        setGetVolumeLocal(getVolumeLocalNew: any): void;
        getGetThemeDefault(): any;
        setGetThemeDefault(getThemeDefaultNew: any): void;
        play(name: string): HTMLAudioElement;
        pauseAll(): void;
        resumeAll(): void;
        pauseTheme(): void;
        resumeTheme(): void;
        clearTheme(): void;
        playLocal(name: string, location?: any): HTMLAudioElement;
        playTheme(name?: string, loop?: boolean): HTMLAudioElement;
        playThemePrefixed(prefix?: string, name?: string, loop?: boolean): HTMLAudioElement;
        addEventListener(name: string, event: string, callback: any): void;
        removeEventListeners(name: string, event: string): void;
        addEventImmediate(name: string, event: string, callback: any): void;
    }
}
