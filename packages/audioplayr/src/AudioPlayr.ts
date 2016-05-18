/// <reference path="../typings/itemsholdr/ItemsHoldr.d.ts" />

import { IItemsHoldr } from "IItemsHoldr";
import { IAudioPlayr, IAudioPlayrSettings, IDirectoriesLibrary, ILibrarySettings, ISoundsLibrary } from "./IAudioPlayr";

/**
 * An audio playback manager for persistent and on-demand themes and sounds.
 */
export class AudioPlayr implements IAudioPlayr {
    /**
     * HTMLAudioElements keyed by their name.
     */
    private library: ISoundsLibrary;

    /**
     * Directories mapping folder names to sound libraries.
     */
    private directories: IDirectoriesLibrary;

    /**
     * What file types to add as sources to sounds.
     */
    private fileTypes: string[];

    /**
     * Currently playing sound objects, keyed by name (excluding extensions).
     */
    private sounds: ISoundsLibrary;

    /**
     * The currently playing theme.
     */
    private theme: HTMLAudioElement;

    /**
     * The name of the currently playing theme.
     */
    private themeName: string;

    /**
     * Directory from which audio files are AJAXed upon startup.
     */
    private directory: string;

    /**
     * The Function or Number used to determine what playLocal's volume is.
     */
    private getVolumeLocal: any;

    /**
     * The Function or String used to get a default theme name.
     */
    private getThemeDefault: any;

    /**
     * Storage container for settings like volume and muted status.
     */
    private ItemsHolder: IItemsHoldr | Storage;

    /**
     * Initializes a new instance of the AudioPlayr class.
     * 
     * @param settings   Settings to use for initialization.
     */
    public constructor(settings: IAudioPlayrSettings) {
        if (typeof settings.library === "undefined") {
            throw new Error("No library given to AudioPlayr.");
        }
        if (typeof settings.directory === "undefined") {
            throw new Error("No directory given to AudioPlayr.");
        }
        if (typeof settings.fileTypes === "undefined") {
            throw new Error("No fileTypes given to AudioPlayr.");
        }
        if (!settings.ItemsHolder) {
            throw new Error("No ItemsHoldr given to AudioPlayr.");
        }

        this.ItemsHolder = settings.ItemsHolder;

        this.directory = settings.directory;
        this.fileTypes = settings.fileTypes;
        this.getThemeDefault = settings.getThemeDefault || "Theme";
        this.getVolumeLocal = typeof settings.getVolumeLocal === "undefined"
            ? 1 : settings.getVolumeLocal;

        // Sounds should always start blank
        this.sounds = {};

        // Preload everything!
        this.generateLibraryFromSettings(settings.library);

        let volumeInitial = this.ItemsHolder.getItem("volume");
        if (volumeInitial === undefined) {
            this.setVolume(1);
        } else {
            this.setVolume(volumeInitial);
        }

        this.setMuted(this.ItemsHolder.getItem("muted") || false);
    }

    /**
     * @returns The listing of <audio> Elements, keyed by name.
     */
    public getLibrary(): any {
        return this.library;
    }

    /**
     * @returns The allowed filetypes for audio files.
     */
    public getFileTypes(): string[] {
        return this.fileTypes;
    }

    /**
     * @returns The currently playing <audio> Elements, keyed by name.
     */
    public getSounds(): any {
        return this.sounds;
    }

    /**
     * @returns The current playing theme's <audio> Element.
     */
    public getTheme(): HTMLAudioElement {
        return this.theme;
    }

    /**
     * @returns The name of the currently playing theme.
     */
    public getThemeName(): string {
        return this.themeName;
    }

    /**
     * @returns The directory under which all filetype directories are to be located.
     */
    public getDirectory(): string {
        return this.directory;
    }

    /**
     * @returns The current volume as a Number in [0,1], retrieved by the ItemsHoldr.
     */
    public getVolume(): number {
        return parseFloat(this.ItemsHolder.getItem("volume")) || 1;
    }

    /**
     * Sets the current volume. If not muted, all sounds will have their volume
     * updated.
     * 
     * @param volume   A Number in [0,1] to set as the current volume.
     */
    public setVolume(volume: number): void {
        if (!this.getMuted()) {
            for (let i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.sounds[i].volume = Number(this.sounds[i].getAttribute("volumeReal")) * volume;
                }
            }
        }

        this.ItemsHolder.setItem("volume", volume.toString());
    }

    /**
     * @returns Whether this is currently muted.
     */
    public getMuted(): boolean {
        return Boolean(Number(this.ItemsHolder.getItem("muted")));
    }

    /**
     * Calls either setMutedOn or setMutedOff as is appropriate.
     * 
     * @param muted   The new status for muted.
     */
    public setMuted(muted: boolean): void {
        this.getMuted() ? this.setMutedOn() : this.setMutedOff();
    }

    /**
     * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
     */
    public toggleMuted(): void {
        this.setMuted(!this.getMuted());
    }

    /**
     * Sets volume to 0 in all currently playing sounds and stores the muted
     * status as on in the internal ItemsHoldr.
     */
    public setMutedOn(): void {
        for (let i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                this.sounds[i].volume = 0;
            }
        }

        this.ItemsHolder.setItem("muted", "1");
    }

    /**
     * Sets sound volumes to their actual volumes and stores the muted status
     * as off in the internal ItemsHoldr.
     */
    public setMutedOff(): void {
        const volume: number = this.getVolume();

        for (let i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                const sound: HTMLAudioElement = this.sounds[i];
                sound.volume = Number(sound.getAttribute("volumeReal")) * volume;
            }
        }

        this.ItemsHolder.setItem("muted", "0");
    }

    /**
     * @returns The Function or Number used as the volume setter for local sounds.    
     */
    public getGetVolumeLocal(): any {
        return this.getVolumeLocal;
    }

    /**
     * @param getVolumeLocal   A new Function or Number to use as the volume setter 
     *                         for local sounds.
     */
    public setGetVolumeLocal(getVolumeLocalNew: any): void {
        this.getVolumeLocal = getVolumeLocalNew;
    }

    /**
     * @returns The Function or String used to get the default theme for playTheme.
     */
    public getGetThemeDefault(): any {
        return this.getThemeDefault;
    }

    /**
     * @param getThemeDefaultNew A new Function or String to use as the source for
     *                           theme names in default playTheme calls.
     */
    public setGetThemeDefault(getThemeDefaultNew: any): void {
        this.getThemeDefault = getThemeDefaultNew;
    }

    /**
     * Plays the sound of the given name. 
     * 
     * @param name   The name of the sound to play.
     * @returns The sound's <audio> element, now playing.
     * @remarks Internally, this stops any previously playing sound of that name 
     *          and starts a new one, with volume set to the current volume and 
     *          muted status. If the name wasn't previously being played (and 
     *          therefore a new Element has been created), an event listener is 
     *          added to delete it from sounds after.
     */
    public play(name: string): HTMLAudioElement {
        let sound: HTMLAudioElement;

        // If the sound isn't yet being played, see if it's in the library
        if (!this.sounds.hasOwnProperty(name)) {
            // If the sound also isn't in the library, it's unknown
            if (!this.library.hasOwnProperty(name)) {
                throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'.");
            }
            sound = this.sounds[name] = this.library[name];
        } else {
            sound = this.sounds[name];
        }

        this.soundStop(sound);

        if (this.getMuted()) {
            sound.volume = 0;
        } else {
            sound.setAttribute("volumeReal", "1");
            sound.volume = this.getVolume();
        }

        this.playSound(sound);
        const used: number = parseFloat(sound.getAttribute("used"));

        // If this is the song's first play, let it know how to stop
        if (!used) {
            sound.setAttribute("used", (used + 1).toString());
            sound.addEventListener("ended", this.soundFinish.bind(this, name));
        }

        sound.setAttribute("name", name);
        return sound;
    }

    /**
     * Pauses all currently playing sounds.
     */
    public pauseAll(): void {
        for (let i in this.sounds) {
            if (this.sounds.hasOwnProperty(i)) {
                this.pauseSound(this.sounds[i]);
            }
        }
    }

    /**
     * Un-pauses (resumes) all currently paused sounds.
     */
    public resumeAll(): void {
        for (let i in this.sounds) {
            if (!this.sounds.hasOwnProperty(i)) {
                continue;
            }
            this.playSound(this.sounds[i]);
        }
    }

    /**
     * Pauses the currently playing theme, if there is one.
     */
    public pauseTheme(): void {
        if (this.theme) {
            this.pauseSound(this.theme);
        }
    }

    /**
     * Resumes the theme, if there is one and it's paused.
     */
    public resumeTheme(): void {
        if (this.theme) {
            this.playSound(this.theme);
        }
    }

    /**
     * Stops all sounds and any theme, and removes all references to them.
     */
    public clearAll(): void {
        this.pauseAll();
        this.clearTheme();
        this.sounds = {};
    }

    /**
     * Pauses and removes the theme, if there is one.
     */
    public clearTheme(): void {
        if (!this.theme) {
            return;
        }

        this.pauseTheme();
        delete this.sounds[this.theme.getAttribute("name")];
        this.theme = undefined;
        this.themeName = undefined;
    }

    /**
     * "Local" version of play that changes the output sound's volume depending
     * on the result of a getVolumeLocal call.
     * 
     * @param name   The name of the sound to play.
     * @param location   An argument for getVolumeLocal, if that's a Function.
     * @returns The sound's <audio> element, now playing.
     */
    public playLocal(name: string, location?: any): HTMLAudioElement {
        const sound: HTMLAudioElement = this.play(name);
        let volumeReal: number;

        switch (this.getVolumeLocal.constructor) {
            case Function:
                volumeReal = this.getVolumeLocal(location);
                break;
            case Number:
                volumeReal = this.getVolumeLocal;
                break;
            default:
                volumeReal = Number(this.getVolumeLocal) || 1;
                break;
        }

        sound.setAttribute("volumeReal", String(volumeReal));

        if (this.getMuted()) {
            sound.volume = 0;
        } else {
            sound.volume = volumeReal * this.getVolume();
        }

        return sound;
    }

    /**
     * Pauses any previously playing theme and starts playback of a new theme.
     * 
     * @param name   The name of the sound to be used as the theme. If not 
     *               provided, getThemeDefault is used to 
     *                          provide one.
     * @param loop   Whether the theme should always loop (by default, true).
     * @returns The theme's <audio> element, now playing.
     * @remarks This is different from normal sounds in that it normally loops
     *          and is controlled by pauseTheme and co. If loop is on and the 
     *          sound wasn't already playing, an event listener is added for 
     *          when it ends.
     */
    public playTheme(name?: string, loop?: boolean): HTMLAudioElement {
        this.pauseTheme();

        // Loop defaults to true
        loop = typeof loop !== "undefined" ? loop : true;

        // If name isn't given, use the default getter
        if (typeof name === "undefined") {
            switch (this.getThemeDefault.constructor) {
                case Function:
                    name = this.getThemeDefault();
                    break;
                default:
                    name = this.getThemeDefault;
                    break;
            }
        }

        // If a theme already exists, kill it
        if (typeof this.theme !== "undefined" && this.theme.hasAttribute("name")) {
            delete this.sounds[this.theme.getAttribute("name")];
        }

        this.themeName = name;
        this.theme = this.sounds[name] = this.play(name);
        this.theme.loop = loop;

        // If it's used (no repeat), add the event listener to resume theme
        if (this.theme.getAttribute("used") === "1") {
            this.theme.addEventListener("ended", this.playTheme.bind(this));
        }

        return this.theme;
    }

    /**
     * Wrapper around playTheme that plays a sound, then a theme. This is 
     * implemented using an event listener on the sound's ending.
     * 
     * @param prefix    The name of a sound to play before the theme.
     * @param name   The name of the sound to be used as the theme. If not 
     *               provided, getThemeDefault is used to 
     *                          provide one.
     * @param loop   Whether the theme should always loop (by default, false).
     * @returns The sound's <audio> element, now playing.
     */
    public playThemePrefixed(prefix: string, name?: string, loop?: boolean): HTMLAudioElement {
        const sound: HTMLAudioElement = this.play(prefix);

        this.pauseTheme();

        // If name isn't given, use the default getter
        if (typeof name === "undefined") {
            switch (this.getThemeDefault.constructor) {
                case Function:
                    name = this.getThemeDefault();
                    break;
                default:
                    name = this.getThemeDefault;
                    break;
            }
        }

        this.addEventListener(prefix, "ended", this.playTheme.bind(this, prefix + " " + name, loop));

        return sound;
    }

    /**
     * Adds an event listener to a currently playing sound. The sound will keep
     * track of event listeners via an .addedEvents attribute, so they can be
     * cancelled later.
     * 
     * @param name   The name of the sound.
     * @param event   The name of the event, such as "ended".
     * @param callback   The Function to be called by the event.
     */
    public addEventListener(name: string, event: string, callback: any): void {
        const sound: any = this.library[name];

        if (!sound) {
            throw new Error(`Unknown name given to addEventListener: '${name}'.`);
        }

        if (!sound.addedEvents) {
            sound.addedEvents = {};
        }

        if (!sound.addedEvents[event]) {
            sound.addedEvents[event] = [callback];
        } else {
            sound.addedEvents[event].push(callback);
        }

        sound.addEventListener(event, callback);
    }

    /**
     * Clears all events added by this.addEventListener to a sound under a given
     * event. 
     * 
     * @param name   The name of the sound.
     * @param event   The name of the event, such as "ended".
     */
    public removeEventListeners(name: string, event: string): void {
        const sound: any = this.library[name];

        if (!sound) {
            throw new Error(`Unknown name given to removeEventListeners: '${name}'.`);
        }

        if (!sound.addedEvents) {
            return;
        }

        const events: any = sound.addedEvents[event];
        if (!events) {
            return;
        }

        for (let i: number = 0; i < events.length; i += 1) {
            sound.removeEventListener(event, events[i]);
        }

        events.length = 0;
    }

    /**
     * Adds an event listener to a sound. If the sound doesn't exist or has 
     * finished playing, it's called immediately.
     * 
     * @param name   The name of the sound.
     * @param event   The name of the event, such as "onended".
     * @param callback   The Function to be called by the event.
     */
    public addEventImmediate(name: string, event: string, callback: any): void {
        if (!this.sounds.hasOwnProperty(name) || this.sounds[name].paused) {
            callback();
            return;
        }

        this.sounds[name].addEventListener(event, callback);
    }

    /**
     * Called when a sound has completed to get it out of sounds.
     * 
     * @param name   The name of the sound that just finished.
     */
    private soundFinish(name: string): void {
        if (this.sounds.hasOwnProperty(name)) {
            delete this.sounds[name];
        }
    }

    /**
     * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
     * function, so this is the shim to do that.
     */
    private soundStop(sound: HTMLAudioElement): void {
        this.pauseSound(sound);
        if (sound.readyState) {
            sound.currentTime = 0;
        }
    }

    /**
     * Loads every sound defined in the library via AJAX. Sounds are loaded
     * into <audio> elements via createAudio and stored in the library.
     */
    private generateLibraryFromSettings(librarySettings: ILibrarySettings): void {
        this.library = {};
        this.directories = {};

        // For each given directory (e.g. names, themes):
        for (let directoryName in librarySettings) {
            if (!librarySettings.hasOwnProperty(directoryName)) {
                continue;
            }

            const directory: ISoundsLibrary = {};
            const directorySoundNames: string[] = librarySettings[directoryName];

            // For each audio file to be loaded in that directory:
            for (let j = 0; j < directorySoundNames.length; j += 1) {
                const name = directorySoundNames[j];

                // Create the sound and store it in the container
                this.library[name] = directory[name] = this.createAudio(name, directoryName);
            }

            // The full directory is stored in the master directories
            this.directories[directoryName] = directory;
        }
    }

    /**
     * Creates an audio element, gives it sources, and starts preloading.
     * 
     * @param name   The name of the sound to play.
     * @param sectionName   The name of the directory containing the sound.
     * @returns An <audio> element ocntaining the sound, currently playing.
     */
    private createAudio(name: string, directory: string): HTMLAudioElement {
        const sound: HTMLAudioElement = document.createElement("audio");

        // Create an audio source for each child
        for (let i: number = 0; i < this.fileTypes.length; i += 1) {
            const sourceType: string = this.fileTypes[i];
            const child: HTMLSourceElement = document.createElement("source") as HTMLSourceElement;

            child.type = "audio/" + sourceType;
            child.src = `${this.directory}/${directory}/${sourceType}/${name}.${sourceType}`;

            sound.appendChild(child);
        }

        // This preloads the sound.
        sound.volume = 0;
        sound.setAttribute("volumeReal", "1");
        sound.setAttribute("used", "0");
        this.playSound(sound);

        return sound;
    }

    /**
     * Utility to try to play a sound, which may not be possible in headless
     * environments like PhantomJS.
     * 
     * @param sound   An <audio> element to play.
     * @returns Whether the sound was able to play.
     */
    private playSound(sound: HTMLAudioElement): boolean {
        if (!sound || !sound.play) {
            return false;
        }

        sound.play();
        return true;
    }

    /**
     * Utility to try to pause a sound, which may not be possible in headless
     * environments like PhantomJS.
     * 
     * @param sound   An <audio> element to pause.
     * @returns Whether the sound was able to pause.
     */
    private pauseSound(sound: HTMLAudioElement): boolean {
        if (!sound || !sound.pause) {
            return false;
        }

        sound.pause();
        return true;
    }
}
