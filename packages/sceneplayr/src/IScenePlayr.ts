/**
 * Cutscenes that may be played, keyed by name.
 */
export interface ICutscenes {
    [i: string]: ICutscene;
}

/**
 * A cutscene, which is a collection of routines.
 */
export interface ICutscene {
    /**
     * The routines available to the cutscene, keyed by name.
     */
    routines: IRoutines;

    /**
     * An optional routine name to play immediately upon starting the cutscene.
     */
    firstRoutine?: string;
}

/**
 * Routines available to a cutscene, keyed by name.
 */
export interface IRoutines {
    [i: string]: IRoutine;
}

/**
 * A routine that may be played within a cutscene.
 * 
 * @param settings   Persistent settings from the parent cutscene.
 * @param args   Any other arguments passed via through playRoutine or bindRoutine.
 */
export interface IRoutine {
    (settings: ICutsceneSettings, ...args: any[]): void;
}

/**
 * Miscellaneous settings for a cutscene.
 */
export interface IPartialCutsceneSettings {
    [i: string]: any;
}

/**
 * Persistent settings kept throughout a cutscene.
 */
export interface ICutsceneSettings extends IPartialCutsceneSettings {
    /**
     * The currently playing cutscene.
     */
    cutscene?: ICutscene;

    /**
     * The name of the parent cutscene.
     */
    cutsceneName?: string;

    /**
     * The currently playing routine.
     */
    routine?: IRoutine;

    /**
     * The name of the current playing routine.
     */
    routineName?: string;

    /**
     * Arguments passed to the currently playing routine.
     */
    routineArguments?: any[];
}

/**
 * Settings to initialize a new IScenePlayr.
 */
export interface IScenePlayrSettings {
    /**
     * Cutscenes that may be played, keyed by names.
     */
    cutscenes?: ICutscenes;

    /**
     * Arguments to pass to each routine within the cutscenes.
     */
    cutsceneArguments?: any[];

    /**
     * The scope routines are run in, if not this IScenePlayr.
     */
    scope?: any;
}

/**
 * A cutscene runner for jumping between scenes and their routines.
 */
export interface IScenePlayr {
    /**
     * @returns The complete listing of cutscenes that may be played.
     */
    getCutscenes(): ICutscenes;

    /**
     * @returns The currently playing cutscene.
     */
    getCutscene(): ICutscene | undefined;

    /**
     * @returns The cutscene referred to by the given name.
     */
    getOtherCutscene(name: string): ICutscene | undefined;

    /**
     * @returns The currently playing routine.
     */
    getRoutine(): IRoutine | undefined;

    /**
     * @param name   The name of a routine to return.
     * @returns The routine within the current cutscene referred to 
     *          by the given name.
     */
    getOtherRoutine(name: string): IRoutine | undefined;

    /**
     * @returns The scope routines are run in, if not this.
     */
    getRoutineScope(): any;

    /**
     * @returns The name of the currently playing cutscene.
     */
    getCutsceneName(): string | undefined;

    /**
     * @returns The settings used by the current cutscene.
     */
    getCutsceneSettings(): any;

    /**
     * Adds a setting to the internal cutscene settings.
     * 
     * @param key   The key for the new setting.
     * @param value   The value for the new setting.
     */
    addCutsceneSetting(key: string, value: any): void;

    /**
     * Starts the cutscene of the given name, keeping the settings Object (if
     * given one). The cutsceneArguments unshift the settings, and if the
     * cutscene specifies a firstRoutine, it's started.
     * 
     * @param name   The name of the cutscene to play.
     * @param [settings]   Additional settings to be kept persistently 
     *                     throughout the cutscene.
     */
    startCutscene(name: string, settings?: any): void;

    /**
     * Returns this.startCutscene bound to the given name and settings.
     * 
     * @param name   The name of the cutscene to play.
     * @param args   Additional settings to be kept as a persistent 
     *               Array throughout the cutscene.
     */
    bindCutscene(name: string, settings?: any): () => void;

    /**
     * Stops the currently playing cutscene and clears the internal data.
     */
    stopCutscene(): void;

    /**
     * Plays a particular routine within the current cutscene, passing
     * the given args as cutsceneSettings.routineArguments.
     * 
     * @param name   The name of the routine to play.
     * @param args   Any additional arguments to pass to the routine.
     */
    playRoutine(name: string, ...args: any[]): void;

    /**
     * Returns this.startCutscene bound to the given name and arguments.
     * 
     * @param name   The name of the cutscene to play.
     * @param args   Any additional arguments to pass to the routine.
     */
    bindRoutine(name: string, ...args: any[]): () => void;
}
