/// <reference path="ScenePlayr.d.ts" />

module ScenePlayr {
    "use strict";

    export class ScenePlayr implements IScenePlayr {

        cutscenes;

        cutscene;

        routine;

        cutsceneName;

        cutsceneSettings;

        cutsceneArguments;

        /**
         * 
         */
        constructor(settings: IScenePlayrSettings = {}) {
            this.cutscenes = settings.cutscenes || {};
            this.cutsceneArguments = settings.cutsceneArguments || [];
        }


        /* Simple gets
        */

        /**
         * 
         */
        getCutscenes() {
            return this.cutscenes;
        }

        /**
         * 
         */
        getCutscene() {
            return this.cutscene;
        }

        /**
         * 
         */
        getRoutine() {
            return this.routine;
        }

        /**
         * 
         */
        getOtherRoutine(name) {
            return this.cutscene.routines[name];
        }

        /**
         * 
         */
        getCutsceneName() {
            return this.cutsceneName;
        }

        /**
         * 
         */
        getCutsceneSettings() {
            return this.cutsceneSettings;
        }


        /* Playback
        */

        /**
         * 
         */
        startCutscene(name, settings?) {
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
         * 
         */
        bindCutscene(name, settings?) {
            return this.startCutscene.bind(self, name, settings);
        }

        /**
         * 
         */
        stopCutscene() {
            this.cutscene = undefined;
            this.cutsceneName = undefined;
            this.cutsceneSettings = undefined;
            this.cutsceneArguments.pop();
        }

        /**
         * 
         */
        playRoutine(name, args?) {
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
         */
        bindRoutine(name, args?) {
            return this.playRoutine.bind(this, name, args);
        }
    }
}
