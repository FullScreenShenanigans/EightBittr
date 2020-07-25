import { FrameTiming } from "./timing";

/**
 * Event hook for running or state change.
 */
export type EventHook = () => void;

/**
 * Function to be run on each tick.
 *
 * @param timestamp   Adjusted timestamp to simulate being run on an exact interval.
 */
export type Frame = (timestamp: DOMHighResTimeStamp) => void;

/**
 * Event hooks for running or state changes.
 */
export interface FrameEvents {
    /**
     * Called after running is paused.
     */
    pause?: EventHook;

    /**
     * Called after running is started.
     */
    play?: EventHook;
}

/**
 * Settings to initialize a new IFrameTickr instance.
 */
export interface FrameTickrSettings {
    /**
     * Event hooks for running or state changes.
     */
    events?: FrameEvents;

    /**
     * Function to be run, on each tick.
     */
    frame: Frame;

    /**
     * How often, in milliseconds, to execute frames (by default, `1000 / 60`).
     */
    interval: number;

    /**
     * Hooks for retrieving and scheduling timing.
     */
    timing: FrameTiming;
}
