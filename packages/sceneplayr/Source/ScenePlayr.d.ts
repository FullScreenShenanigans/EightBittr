declare module ScenePlayr {
    export interface ICutscenes {
        [i: string]: ICutscene;
    }

    export interface ICutscene {
        firstRoutine?: string;
        routines: IRoutines;
    }

    export interface IRoutines {
        [i: string]: IRoutine;
    }

    export interface IRoutine {
        (settings: ICutsceneSettings, ...args: any[]): void;
    }

    export interface ICutsceneSettings {
        cutscene: ICutscene;
        cutsceneName: string;
        routine: IRoutine;
        routineName: string;
        routineArguments: any[];
    }

    export interface IScenePlayrSettings {
        cutscenes?: ICutscenes;
        cutsceneArguments?: any[];
    }

    export interface IScenePlayr {

    }
}
