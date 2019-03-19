import { IFrameTiming } from "./timing";

/**
 * Event hook for running or state change.
 */
export type IEventHook = () => void;

/**
 * Function to be run on each tick.
 *
 * @param timestamp   Adjusted timestamp to simulate being run on an exact interval.
 */
export type IFrame = (timestamp: DOMHighResTimeStamp) => void;

/**
 * Event hooks for running or state changes.
 */
export interface IFrameEvents {
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
 * Settings to initialize a new IFrameTickr instance.
 */
export interface IFrameTickrSettings {
    /**
     * Event hooks for running or state changes.
     */
    events: IFrameEvents;

    /**
     * Function to be run, on each tick.
     */
    frame: IFrame;

    /**
     * How often, in milliseconds, to execute frames (by default, `1000 / 60`).
     */
    interval: number;

    /**
     * Hooks for retrieving and scheduling timing.
     */
    timing: IFrameTiming;
}

/**
 * Runs a series of callbacks on a timed interval.
 */
export interface IFrameTickr {
    /**
     * Gets the time interval between frame executions.
     *
     * @returns Time interval between frame executions in milliseconds.
     */
    getInterval(): number;

    /**
     * Gets whether this is paused.
     *
     * @returns Whether this is paused.
     */
    getPaused(): boolean;

    /**
     * Starts execution of frames.
     */
    play(): void;

    /**
     * Stops execution of frames.
     */
    pause(): void;

    /**
     * Sets the interval between frame executions.
     *
     * @param interval   New time interval in milliseconds.
     */
    setInterval(interval: number): void;
}
