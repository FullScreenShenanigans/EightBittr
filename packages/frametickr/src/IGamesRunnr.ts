/**
 * Schedules a next tick.
 *
 * @param callback   Next tick to run.
 * @param timeout   How long to wait before calling the next tick.
 * @returns Cancellation token for the next tick.
 */
export type ITickScheduler = (callback: () => void, timeout: number) => {};

/**
 * Cancels running a next tick.
 *
 * @param handle   Cancellation token for a next tick.
 */
export type ITickCanceller = (handle: {}) => void;

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
     * How often, in milliseconds, to execute games (by default, 1000 / 60).
     */
    interval: number;

    /**
     * Schedules a next tick (by default, setTimeout).
     */
    tickScheduler: ITickScheduler;

    /**
     * Cancels a next tick (by default, clearTimeout).
     */
    tickCanceller: ITickCanceller;
}

/**
 * Runs a series of callbacks on a timed interval.
 */
export interface IGamesRunnr {
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
