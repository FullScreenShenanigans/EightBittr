import { IFPSAnalyzr } from "fpsanalyzr/lib/IFPSAnalyzr";

/**
 * A callback for when the game changes playing state (pause or play).
 */
export interface ITriggerCallback {
    (...args: any[]): void;
}

/**
 * A callback to schedule each upkeep.
 *
 * @param callback   The next upkeep to run.
 * @param timeout   How long to wait before calling the next upkeep.
 * @returns A unique identifier that can be passed to an upkeep cancellation.
 */
export interface IUpkeepScheduler {
    (callback: Function, timeout: number): number;
}

/**
 * A callback to disable an upkeep.
 *
 * @param handle   The unique identifier of the upkeep to cancel.
 */
export interface IUpkeepCanceller {
    (handle: number): void;
}

/**
 * Settings to initialize a new IGamesRunnr instance.
 */
export interface IGamesRunnrSettings {
    /**
     * The functions to run on each upkeep.
     */
    games?: Function[];

    /**
     * How often, in milliseconds, to call upkeep (by default, 1000/60).
     */
    interval?: number;

    /**
     * A multiplier for interval that can be set independently.
     */
    speed?: number;

    /**
     * A callback to run when upkeep is paused.
     */
    onPause?: ITriggerCallback;

    /**
     * A callback to run when play is closed.
     */
    onClose?: ITriggerCallback;

    /**
     * A callback to run when upkeep is played.
     */
    onPlay?: ITriggerCallback;

    /**
     * Arguments to be passed to onPause and onPlay (by default, [this]).
     */
    callbackArguments?: any[];

    /**
     * A Function to replace setTimeout as the upkeepScheduler.
     */
    upkeepScheduler?: IUpkeepScheduler;

    /**
     * A Function to replace clearTimeout as the upkeepCanceller.
     */
    upkeepCanceller?: IUpkeepCanceller;
}

/**
 * Runs a series of callbacks on a timed interval.
 */
export interface IGamesRunnr {
    /**
     * Storage and analysis for framerate measurements.
     */
    readonly fpsAnalyzer: IFPSAnalyzr;

    /**
     * @returns Whether this is paused.
     */
    getPaused(): boolean;

    /**
     * @returns The Array of game Functions.
     */
    getGames(): any[];

    /**
     * @returns The interval between upkeeps.
     */
    getInterval(): number;

    /**
     * @returns The speed multiplier being applied to the interval.
     */
    getSpeed(): number;

    /**
     * Meaty function, run every <interval*speed> milliseconds, to mark an FPS
     * measurement and run every game once.
     */
    upkeep(): void;

    /**
     * A utility for this.upkeep that calls the same games.forEach(run), timing
     * the total execution time.
     *
     * @returns The total time spent, in milliseconds.
     */
    upkeepTimed(): number;

    /**
     * Continues execution of this.upkeep by calling it. If an onPlay has been
     * defined, it's called before.
     */
    play(): void;

    /**
     * Stops execution of this.upkeep, and cancels the next call. If an onPause
     * has been defined, it's called after.
     */
    pause(): void;

    /**
     * Calls upkeep a <num or 1> number of times, immediately.
     *
     * @param [num]   How many times to upkeep (by default, 1).
     */
    step(times?: number): void;

    /**
     * Toggles whether this is paused, and calls the appropriate Function.
     */
    togglePause(): void;

    /**
     * Sets the interval between between upkeeps.
     *
     * @param interval   The new time interval in milliseconds.
     */
    setInterval(interval: number): void;

    /**
     * Sets the speed multiplier for the interval.
     *
     * @param speed   The new speed multiplier. 2 will cause interval to be
     *                twice as fast, and 0.5 will be half as fast.
     */
    setSpeed(speed: number): void;
}
