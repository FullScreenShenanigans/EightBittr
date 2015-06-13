declare module GamesRunnr {
    export interface IGamesRunnrSettings {
        // The Array of Functions to run on each upkeep.
        games: any[];

        // How often, in milliseconds, to call upkeep when playing (defaults to
        // 1000 / 60).
        interval?: number;

        // A multiplier for interval that can be set independently.
        speed?: number;

        // Whether scheduling timeouts should adjust to elapsed upkeep time.
        adjustFramerate?: boolean;

        // A callback to run when upkeep is paused.
        onPause?: (...args: any[]) => void;

        // A callback to run when upkeep is played.
        onPlay?: (...args: any[]) => void;

        // Arguments to be passed to onPause and onPlay (by default, [this])
        callbackArguments?: any[];

        // A Function to replace setTimeout.
        /**
         * A Function to replace setTimeout as the upkeepScheduler.
         */
        upkeepScheduler?: (callback: Function, timeout: number) => number;

        /**
         * A Function to replace clearTimeout as the upkeepCanceller.
         */
        upkeepCanceller?: (handle: number) => void;

        /**
         * A scope for games to be run on (defaults to the calling GamesRunnr).
         */
        scope?: any;

        /**
         * An FPSAnalyzr to provide statistics on automated playback. If not 
         * provided, a new one will be made.
         */
        FPSAnalyzer?: FPSAnalyzr.IFPSAnalyzr;

        /**
         * Settings to create a new FPSAnalyzr, if one isn't provided.
         */
        FPSAnalyzerSettings?: FPSAnalyzr.IFPSAnalyzrSettings;
    }

    export interface IGamesRunnr {
        getFPSAnalyzer(): FPSAnalyzr.IFPSAnalyzr;
        getPaused(): boolean;
        getGames(): any[];
        getInterval(): number;
        getSpeed(): number;
        getOnPause(): any;
        getOnPlay(): any;
        getCallbackArguments(): any[];
        getUpkeepScheduler(): (callback: Function, timeout: number) => number;
        getUpkeepCanceller(): (handle: number) => void;
        upkeep(): void;
        upkeepTimed(): number;
        play(): void;
        pause(): void;
        step(times?: number): void;
        togglePause(): void;
        setInterval(interval: number): void;
        setSpeed(speed: number): void;
    }
}
