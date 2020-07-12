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
    events?: IFrameEvents;

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
