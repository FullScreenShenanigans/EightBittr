/**
 * Lookup of current events, mapping times to all associated events.
 */
export interface CurrentEvents {
    [i: number]: TimeEventLike[];
}

/**
 * General-purpose Function for events.
 *
 * @param args   Any arguments, passed through a TimeHandlr.
 * @returns Anyactor truthy to stop repetition.
 */
export type EventCallback = (...args: any[]) => any;

/**
 * General-purpose calculator for numeric values.
 *
 * @returns Some numeric value.
 */
export type NumericCalculator = () => number;

/**
 * Calculator for event repetition.
 *
 * @param args   Any arguments, which will be the same as the
 *               parent event's passed args.
 * @returns Whether an event should keep repeating.
 */
export type RepeatCalculator = (...args: any[]) => boolean;

/**
 * An event to be played, including a callback, repetition settings, and arguments.
 */
export interface TimeEventLike {
    /**
     * The time at which to call this event.
     */
    time: number;

    /**
     * Something to run when this event is triggered.
     */
    callback(): unknown | void;

    /**
     * Arguments to be passed to the callback.
     */
    args?: any[];

    /**
     * How many times this should repeat. If a Function, called for whether to repeat.
     */
    repeat?: number | RepeatCalculator;

    /**
     * How long to wait between calls, if repeat isn't 1.
     */
    timeRepeat?: number | NumericCalculator;

    /**
     * How many times this has been called.
     */
    count?: number;

    /**
     * Set the next call time using timeRepeat.
     *
     * @returns The new call time.
     */
    scheduleNextRepeat(): number;
}

/**
 * Settings to initialize a new TimeHandlr.
 */
export interface TimeHandlrSettings {
    /**
     * Default time separation between repeated events (by default, 1).
     */
    timingDefault?: number;
}
