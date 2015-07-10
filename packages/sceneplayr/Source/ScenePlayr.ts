// @ifdef INCLUDE_DEFINITIONS
/// <reference path="ScenePlayr.d.ts" />
// @endif

// @include ../Source/ScenePlayr.d.ts

module ScenePlayr {
    "use strict";

    export class ScenePlayr implements IScenePlayr {
        /**
         * The complete listing of cutscenes that may be played, keyed by name.
         */
        private cutscenes: ICutscenes;

        /**
         * The currently playing cutscene.
         */
        private cutscene: ICutscene;

        /**
         * The currently playing routine within the current cutscene.
         */
        private routine: IRoutine;

        /**
         * The name of the current cutscene.
         */
        private cutsceneName: string;

        /**
         * Persistent settings for the current cutscene, passed to each routine.
         */
        private cutsceneSettings: ICutsceneSettings;

        /**
         * Any additional arguments to pass to routines.
         */
        private cutsceneArguments: any[];

        /**
         * @param {IScenePlayrSettings} [settings]
         */
        constructor(settings: IScenePlayrSettings = {}) {
            this.cutscenes = settings.cutscenes || {};
            this.cutsceneArguments = settings.cutsceneArguments || [];
        }


        /* Simple gets
        */

        /**
         * @return {Object} The complete listing of cutscenes that may be played.
         */
        getCutscenes(): ICutscenes {
            return this.cutscenes;
        }

        /**
         * @return {Object} The currently playing cutscene.
         */
        getCutscene(): ICutscene {
            return this.cutscene;
        }

        /**
         * @return {Object} The cutscene referred to by the given name.
         */
        getOtherCutscene(name: string): ICutscene {
            return this.cutscenes[name];
        }

        /**
         * @return {Function} The currently playing routine.
         */
        getRoutine(): IRoutine {
            return this.routine;
        }

        /**
         * @return {Function} The routine within the current cutscene referred to 
         *                    by the given name.
         */
        getOtherRoutine(name: string): IRoutine {
            return this.cutscene.routines[name];
        }

        /**
         * @return {String} The name of the currently playing cutscene.
         */
        getCutsceneName(): string {
            return this.cutsceneName;
        }

        /**
         * @return {Object} The settings used by the current cutscene.
         */
        getCutsceneSettings(): any {
            return this.cutsceneSettings;
        }


        /* Playback
        */

        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         * 
         * @param {String} name   The name of the cutscene to play.
         * @param {Object} [settings]   Additional settings to be kept as a
         *                              persistent Object throughout the cutscene.
         */
        startCutscene(name: string, settings: any = {}): void {
            if (!name) {
                throw new Error("No name given to ScenePlayr.playScene.");
            }

            if (this.cutsceneName) {
                this.stopCutscene();
            }

            this.cutscene = this.cutscenes[name];
            this.cutsceneName = name;
            this.cutsceneSettings = settings || {};

            this.cutsceneSettings.cutscene = this.cutscene;
            this.cutsceneSettings.cutsceneName = name;

            this.cutsceneArguments.push(this.cutsceneSettings);

            if (this.cutscene.firstRoutine) {
                this.playRoutine(this.cutscene.firstRoutine);
            }
        }

        /**
         * Returns this.startCutscene bound to the given name and settings.
         * 
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Additional settings to be kept as a
         *                            persistent Object throughout the cutscene.
         */
        bindCutscene(name: string, ...args: any[]): () => void {
            return this.startCutscene.bind(self, name, args);
        }

        /**
         * Stops the currently playing cutscene, clearing the internal data.
         */
        stopCutscene(): void {
            this.cutscene = undefined;
            this.cutsceneName = undefined;
            this.cutsceneSettings = undefined;
            this.routine = undefined;
            this.cutsceneArguments.pop();
        }

        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         * 
         * @param {String} name   The name of the routine to play.
         * @param {Array} ...args   Any additional arguments to pass to the routine.
         */
        playRoutine(name: string, ...args: any[]): void {
            if (!this.cutscene) {
                throw new Error("No cutscene is currently playing.");
            }

            if (!this.cutscene.routines[name]) {
                throw new Error("The " + this.cutsceneName + " cutscene does not contain a " + name + " routine.");
            }

            this.routine = this.cutscene.routines[name];

            this.cutsceneSettings.routine = this.routine;
            this.cutsceneSettings.routineName = name;
            this.cutsceneSettings.routineArguments = args;

            this.routine.apply(this, this.cutsceneArguments);
        }

        /**
         * 
         * Returns this.startCutscene bound to the given name and arguments.
         * 
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Any additional arguments to pass to the routine.
         */
        bindRoutine(name: string, ...args: any[]): () => void {
            return this.playRoutine.bind(this, name, args);
        }
    }
}
