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
        onPause?: any;

        // A callback to run when upkeep is played.
        onPlay?: any;

        // Arguments to be passed to onPause and onPlay (by default, [this])
        callbackArguments?: any[];

        // A Function to replace setTimeout.
        upkeepScheduler?: any;

        // A Function to replace clearTimeout.
        upkeepCanceller?: any;

        // A scope for games to be run on (defaults to this).
        scope?: any;

        // An FPSAnalyzr to provide statistics on automated playback. If not 
        // provided, a new one will be made.
        FPSAnalyzer?: FPSAnalyzr.IFPSAnalyzr;
    }

    export interface IGamesRunnr {

    }
}