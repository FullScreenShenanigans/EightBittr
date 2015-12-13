// @echo '/// <reference path="FPSAnalyzr-0.2.1.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/FPSAnalyzr-0.2.1.ts" />
/// <reference path="GamesRunnr.d.ts" />
// @endif

// @include ../Source/GamesRunnr.d.ts

module GamesRunnr {
    "use strict";

    /**
     * A class to continuously series of "game" Functions. Each game is run in a 
     * set order and the group is run as a whole at a particular interval, with a
     * configurable speed. Playback can be triggered manually, or driven by a timer
     * with pause and play hooks. For automated playback, statistics are 
     * available via an internal FPSAnalyzer.
     */
    export class GamesRunnr implements IGamesRunnr {
        /**
         * Functions to be run, in order, on each upkeep.
         */
        private games: Function[];

        /**
         * Optional trigger Function for this.pause.
         */
        private onPause: ITriggerCallback;

        /**
         * Optional trigger Function for this.play.
         */
        private onPlay: ITriggerCallback;

        /**
         * Arguments to be passed to the optional trigger Functions.
         */
        private callbackArguments: any[];

        /**
         * Reference to the next upkeep, such as setTimeout's returned int.
         */
        private upkeepNext: number;

        /**
         * Function used to schedule the next upkeep, such as setTimeout.
         */
        private upkeepScheduler: IUpkeepScheduler;

        /**
         * Function used to cancel the next upkeep, such as clearTimeout
         */
        private upkeepCanceller: (handle: number) => void;

        /**
         * this.upkeep bound to this GamesRunnr, for use in upkeepScheduler.
         */
        private upkeepBound: any;

        /**
         * Whether the game is currently paused.
         */
        private paused: boolean;

        /**
         * The amount of time, in milliseconds, between each upkeep.
         */
        private interval: number;

        /**
         * The playback rate multiplier (defaults to 1, for no change).
         */
        private speed: number;

        /**
         * The actual speed, as (1 / speed) * interval.
         */
        private intervalReal: number;

        /**
         * An internal FPSAnalyzr object that measures on each upkeep.
         */
        private FPSAnalyzer: FPSAnalyzr.IFPSAnalyzr;

        /**
         * An object to set as the scope for games, if not this GamesRunnr.
         */
        private scope: any;

        /**
         * Whether scheduling timeouts should adjust to elapsed upkeep time.
         */
        private adjustFramerate: boolean;

        /**
         * Initializes a new instance of the GamesRunnr class.
         * 
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IGamesRunnrSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given GamesRunnr.");
            }
            if (typeof settings.games === "undefined") {
                throw new Error("No games given to GamesRunnr.");
            }

            var i: number;

            this.games = settings.games;
            this.interval = settings.interval || 1000 / 60;
            this.speed = settings.speed || 1;
            this.onPause = settings.onPause;
            this.onPlay = settings.onPlay;
            this.callbackArguments = settings.callbackArguments || [this];
            this.adjustFramerate = settings.adjustFramerate;
            this.FPSAnalyzer = settings.FPSAnalyzer || new FPSAnalyzr.FPSAnalyzr(settings.FPSAnalyzerSettings);

            this.scope = settings.scope || this;
            this.paused = true;

            this.upkeepScheduler = settings.upkeepScheduler || function (handler: any, timeout: number): number {
                return setTimeout(handler, timeout);
            };
            this.upkeepCanceller = settings.upkeepCanceller || function (handle: number): void {
                clearTimeout(handle);
            };

            this.upkeepBound = this.upkeep.bind(this);

            for (i = 0; i < this.games.length; i += 1) {
                this.games[i] = this.games[i].bind(this.scope);
            }

            this.setIntervalReal();
        }


        /* Gets
        */

        /** 
         * @returns The FPSAnalyzer used in the GamesRunnr.
         */
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr {
            return this.FPSAnalyzer;
        }

        /**
         * @returns Whether this is paused.
         */
        getPaused(): boolean {
            return this.paused;
        }

        /**
         * @returns The Array of game Functions.
         */
        getGames(): Function[] {
            return this.games;
        }

        /**
         * @returns The interval between upkeeps.
         */
        getInterval(): number {
            return this.interval;
        }

        /**
         * @returns The speed multiplier being applied to the interval.
         */
        getSpeed(): number {
            return this.speed;
        }

        /**
         * @returns The optional trigger to be called on pause.
         */
        getOnPause(): any {
            return this.onPause;
        }

        /**
         * @returns The optional trigger to be called on play.
         */
        getOnPlay(): any {
            return this.onPlay;
        }

        /**
         * @returns Arguments to be given to the optional trigger Functions.
         */
        getCallbackArguments(): any[] {
            return this.callbackArguments;
        }

        /**
         * @returns Function used to schedule the next upkeep.
         */
        getUpkeepScheduler(): IUpkeepScheduler {
            return this.upkeepScheduler;
        }

        /**
         * @returns {Function} Function used to cancel the next upkeep.
         */
        getUpkeepCanceller(): (handle: number) => void {
            return this.upkeepCanceller;
        }


        /* Runtime
        */

        /**
         * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
         * measurement and run every game once.
         */
        upkeep(): void {
            if (this.paused) {
                return;
            }

            // Prevents double upkeeping, in case a new upkeepNext was scheduled.
            this.upkeepCanceller(this.upkeepNext);

            if (this.adjustFramerate) {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal - (this.upkeepTimed() | 0));
            } else {
                this.upkeepNext = this.upkeepScheduler(this.upkeepBound, this.intervalReal);
                this.runAllGames();
            }

            if (this.FPSAnalyzer) {
                this.FPSAnalyzer.measure();
            }
        }

        /**
         * A utility for this.upkeep that calls the same games.forEach(run), timing
         * the total execution time.
         * 
         * @returns The total time spent, in milliseconds.
         */
        upkeepTimed(): number {
            if (!this.FPSAnalyzer) {
                throw new Error("An internal FPSAnalyzr is required for upkeepTimed.");
            }

            var now: number = this.FPSAnalyzer.getTimestamp();
            this.runAllGames();
            return this.FPSAnalyzer.getTimestamp() - now;
        }

        /**
         * Continues execution of this.upkeep by calling it. If an onPlay has been
         * defined, it's called before.
         */
        play(): void {
            if (!this.paused) {
                return;
            }
            this.paused = false;

            if (this.onPlay) {
                this.onPlay.apply(this, this.callbackArguments);
            }

            this.upkeep();
        }

        /**
         * Stops execution of this.upkeep, and cancels the next call. If an onPause
         * has been defined, it's called after.
         */
        pause(): void {
            if (this.paused) {
                return;
            }
            this.paused = true;

            if (this.onPause) {
                this.onPause.apply(this, this.callbackArguments);
            }

            this.upkeepCanceller(this.upkeepNext);
        }

        /**
         * Calls upkeep a <num or 1> number of times, immediately.
         * 
         * @param [num]   How many times to upkeep (by default, 1).
         */
        step(times: number = 1): void {
            this.play();
            this.pause();
            if (times > 0) {
                this.step(times - 1);
            }
        }

        /**
         * Toggles whether this is paused, and calls the appropriate Function.
         */
        togglePause(): void {
            this.paused ? this.play() : this.pause();
        }


        /* Games manipulations
        */

        /**
         * Sets the interval between between upkeeps.
         * 
         * @param interval   The new time interval in milliseconds.
         */
        setInterval(interval: number): void {
            var intervalReal: number = Number(interval);

            if (isNaN(intervalReal)) {
                throw new Error("Invalid interval given to setInterval: " + interval);
            }

            this.interval = intervalReal;
            this.setIntervalReal();
        }

        /**
         * Sets the speed multiplier for the interval.
         * 
         * @param speed   The new speed multiplier. 2 will cause interval to be
         *                twice as fast, and 0.5 will be half as fast.
         */
        setSpeed(speed: number): void {
            var speedReal: number = Number(speed);

            if (isNaN(speedReal)) {
                throw new Error("Invalid speed given to setSpeed: " + speed);
            }

            this.speed = speedReal;
            this.setIntervalReal();
        }


        /* Utilities
        */

        /**
         * Sets the intervalReal variable, which is interval * (inverse of speed).
         */
        private setIntervalReal(): void {
            this.intervalReal = (1 / this.speed) * this.interval;
        }

        /**
         * Runs all games in this.games.
         */
        private runAllGames(): void {
            for (var i: number = 0; i < this.games.length; i += 1) {
                this.games[i]();
            }
        }
    }
}
