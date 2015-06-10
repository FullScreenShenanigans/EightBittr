declare module AudioPlayr {
    export interface IAudioPlayrSettings {
        // The names of the audio files to be preloaded so they can later be played
        // by the AudioPlayr. The internal library stores Objects inside it, 
        // representing the paths within each filetype's directory.
        library: any;

        // The directory in which all sub-directories of audio files are stored.
        directory: string;

        // The allowed filetypes for each audio file. Each of these should have a
        // directory of their name under the main directory, which should contain
        // each file of the filetype.
        fileTypes: string[];

        // A StatsHoldr to store mute/volume status locally.
        StatsHolder: StatsHoldr.IStatsHoldr;

        // A Function or String to get the default theme for playTheme calls. 
        // Functions are called for a return value, and Strings are constant
        // (defaults to "Theme").
        getThemeDefault?: any;

        // A Function or Number to get the "local" volume for playLocal calls. 
        // Functions are called for a return value, and Numbers are constant 
        // (defaults to 1).
        getVolumeLocal?: any;
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