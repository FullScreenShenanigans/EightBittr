/**
 * Cutscenes that may be played, keyed by name.
 */
export type Cutscenes = Record<string, Cutscene>;

/**
 * A cutscene, which is a collection of routines.
 */
export interface Cutscene {
    /**
     * The routines available to the cutscene, keyed by name.
     */
    routines: Routines;

    /**
     * An optional routine name to play immediately upon starting the cutscene.
     */
    firstRoutine?: string;
}

/**
 * Routines available to a cutscene, keyed by name.
 */
export type Routines = Record<string, Routine>;

/**
 * A routine that may be played within a cutscene.
 *
 * @param settings   Persistent settings from the parent cutscene.
 * @param args   Any other arguments passed via through playRoutine or bindRoutine.
 */
export type Routine = (settings: CutsceneSettings, ...args: any[]) => void;

/**
 * Miscellaneous settings for a cutscene.
 */
export type PartialCutsceneSettings = Record<string, any>;

/**
 * Persistent settings kept throughout a cutscene.
 */
export interface CutsceneSettings extends PartialCutsceneSettings {
    /**
     * The currently playing cutscene.
     */
    cutscene?: Cutscene;

    /**
     * The name of the parent cutscene.
     */
    cutsceneName?: string;

    /**
     * The currently playing routine.
     */
    routine?: Routine;

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
export interface ScenePlayrSettings {
    /**
     * Cutscenes that may be played, keyed by names.
     */
    cutscenes?: Cutscenes;

    /**
     * Arguments to pass to each routine within the cutscenes.
     */
    cutsceneArguments?: any[];

    /**
     * The scope routines are run in, if not this IScenePlayr.
     */
    scope?: any;
}
