import {
    ICutscene, ICutscenes, ICutsceneSettings, IPartialCutsceneSettings,
    IRoutine, IScenePlayr, IScenePlayrSettings,
} from "./IScenePlayr";

/**
 * A stateful cutscene runner for jumping between scenes and their routines.
 */
export class ScenePlayr implements IScenePlayr {
    /**
     * The complete listing of cutscenes that may be played, keyed by name.
     */
    private readonly cutscenes: ICutscenes;

    /**
     * The scope routines are run in, if not this.
     */
    private readonly scope: any;

    /**
     * The currently playing cutscene.
     */
    private cutscene?: ICutscene;

    /**
     * The currently playing routine within the current cutscene.
     */
    private routine?: IRoutine;

    /**
     * The name of the current cutscene.
     */
    private cutsceneName?: string;

    /**
     * Persistent settings for the current cutscene, passed to each routine.
     */
    private cutsceneSettings: ICutsceneSettings;

    /**
     * Any additional arguments to pass to routines.
     */
    private cutsceneArguments: any[];

    /**
     * Initializes a new instance of the ScenePlayr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IScenePlayrSettings = {}) {
        this.cutscenes = settings.cutscenes || {};
        this.cutsceneArguments = settings.cutsceneArguments || [];
        this.scope = settings.scope || this;
    }

    /**
     * @returns The complete listing of cutscenes that may be played.
     */
    public getCutscenes(): ICutscenes {
        return this.cutscenes;
    }

    /**
     * @returns The currently playing cutscene.
     */
    public getCutscene(): ICutscene | undefined {
        return this.cutscene;
    }

    /**
     * @returns The cutscene referred to by the given name.
     */
    public getOtherCutscene(name: string): ICutscene | undefined {
        return this.cutscenes[name];
    }

    /**
     * @returns The currently playing routine.
     */
    public getRoutine(): IRoutine | undefined {
        return this.routine;
    }

    /**
     * @param name   The name of a routine to return.
     * @returns The routine within the current cutscene referred to
     *          by the given name.
     */
    public getOtherRoutine(name: string): IRoutine | undefined {
        if (!this.cutscene) {
            throw new Error("No cutscene is currently playing.");
        }

        return this.cutscene.routines[name];
    }

    /**
     * @returns The scope routines are run in, if not this.
     */
    public getRoutineScope(): any {
        return this.scope;
    }

    /**
     * @returns The name of the currently playing cutscene.
     */
    public getCutsceneName(): string | undefined {
        return this.cutsceneName;
    }

    /**
     * @returns The settings used by the current cutscene.
     */
    public getCutsceneSettings(): ICutsceneSettings {
        return this.cutsceneSettings;
    }

    /**
     * Adds a setting to the internal cutscene settings.
     *
     * @param key   The key for the new setting.
     * @param value   The value for the new setting.
     */
    public addCutsceneSetting(key: string, value: any): void {
        this.cutsceneSettings[key] = value;
    }

    /**
     * Starts the cutscene of the given name, keeping the settings Object (if
     * given one). The cutsceneArguments unshift the settings, and if the
     * cutscene specifies a firstRoutine, it's started.
     *
     * @param name   The name of the cutscene to play.
     * @param settings   Additional settings to be kept persistently
     *                     throughout the cutscene.
     */
    public startCutscene(name: string, settings: IPartialCutsceneSettings = {}, args?: any): void {
        if (!name) {
            throw new Error("No name given to ScenePlayr.playScene.");
        }

        if (this.cutsceneName) {
            this.stopCutscene();
        }

        this.cutsceneSettings = settings as ICutsceneSettings;

        this.cutscene = this.cutsceneSettings.cutscene = this.cutscenes[name];
        this.cutsceneName = this.cutsceneSettings.cutsceneName = name;

        this.cutsceneArguments.push(this.cutsceneSettings);

        if (this.cutscene.firstRoutine) {
            this.playRoutine(this.cutscene.firstRoutine, ...args);
        }
    }

    /**
     * Returns this.startCutscene bound to the given name and settings.
     *
     * @param name   The name of the cutscene to play.
     * @param settings   Additional settings to be kept as a persistent Object
     *                   throughout the cutscene.
     * @param args   Arguments for the firstRoutine, if it exists.
     */
    public bindCutscene(name: string, settings: any = {}, args?: any): () => void {
        return (): void => {
            this.startCutscene(name, settings, args);
        };
    }

    /**
     * Stops the currently playing cutscene and clears the internal data.
     */
    public stopCutscene(): void {
        this.routine = undefined;
        this.cutscene = undefined;
        this.cutsceneName = undefined;
        this.cutsceneSettings = {};
        this.cutsceneArguments.pop();
    }

    /**
     * Plays a particular routine within the current cutscene, passing
     * the given args as cutsceneSettings.routineArguments.
     *
     * @param name   The name of the routine to play.
     * @param args   Any additional arguments to pass to the routine.
     */
    public playRoutine(name: string, ...args: any[]): void {
        if (!this.cutscene) {
            throw new Error("No cutscene is currently playing.");
        }
        if (!this.cutscene.routines[name]) {
            throw new Error(`The '${this.cutsceneName}' cutscene does not contain a '${name}' routine.`);
        }

        // Copy the given ...args to a new Array from this.cutsceneArguments
        // This is better than args.unshift to not modify args, if they're given directly
        const routineArgs: any[] = this.cutsceneArguments.slice();
        routineArgs.push(...args);

        this.routine = this.cutscene.routines[name];

        this.cutsceneSettings.routine = this.routine;
        this.cutsceneSettings.routineName = name;
        this.cutsceneSettings.routineArguments = args;

        this.routine.apply(this.scope, routineArgs);
    }

    /**
     * Returns this.startCutscene bound to the given name and arguments.
     *
     * @param name   The name of the cutscene to play.
     * @param args   Any additional arguments to pass to the routine.
     */
    public bindRoutine(name: string, ...args: any[]): () => void {
        return (): void => {
            this.playRoutine(name, ...args);
        };
    }
}
