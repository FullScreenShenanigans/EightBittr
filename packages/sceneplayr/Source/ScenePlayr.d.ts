declare module ScenePlayr {
    export interface ICutscenes {
        [i: string]: ICutscene;
    }

    export interface ICutscene { }

    export interface IScenePlayrSettings {
        cutscenes?: ICutscenes;
        cutsceneArguments?: any[];
    }

    export interface IScenePlayr {

    }
}
