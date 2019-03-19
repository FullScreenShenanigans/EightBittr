import { IGameTiming } from "./timing";

/**
 * Event hook for running or state change.
 */
export type IEventHook = () => void;

/**
 * Function to be run on each tick.
 */
export type IGame = () => void;

/**
 * Event hooks for running or state changes.
 */
export interface IGameEvents {
    /**
     * Called after running is paused.
     */
    pause?: IEventHook;

    /**
     * Called after running is started.
     */
    play?: IEventHook;
}

/**
 * Settings to initialize a new IGamesRunnr instance.
 */
export interface IGamesRunnrSettings {
    /**
     * Event hooks for running or state changes.
     */
    events: IGameEvents;

    /**
     * Functions to be run, in order, on each tick.
     */
    games: IGame[];

    /**
     * How often, in milliseconds, to execute games (by default, `1000 / 60`).
     */
    interval: number;

    /**
     * Hooks for retrieving and scheduling timing.
     */
    timing: IGameTiming;
}

/**
 * Runs a series of callbacks on a timed interval.
 */
export interface IGamesRunnr {
    /**
     * Gets the time interval between game executions.
     *
     * @returns Time interval between game executions in milliseconds.
     */
    getInterval(): number;

    /**
     * Gets whether this is paused.
     *
     * @returns Whether this is paused.
     */
    getPaused(): boolean;

    /**
     * Starts execution of games.
     */
    play(): void;

    /**
     * Stops execution of games.
     */
    pause(): void;

    /**
     * Sets the interval between game executions.
     *
     * @param interval   New time interval in milliseconds.
     */
    setInterval(interval: number): void;
}
