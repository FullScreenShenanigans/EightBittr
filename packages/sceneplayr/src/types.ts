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
export type IRoutine = (settings: ICutsceneSettings, ...args: any[]) => void;

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
