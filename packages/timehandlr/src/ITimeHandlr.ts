/**
 * Lookup of current events, mapping times to all associated events.
 */
export interface ICurrentEvents {
    [i: number]: ITimeEvent[];
}

/**
 * General-purpose Function for events.
 *
 * @param args   Any arguments, passed through a TimeHandlr.
 * @returns Anything truthy to stop repetition.
 */
export type IEventCallback = (...args: any[]) => any;

/**
 * General-purpose calculator for numeric values.
 *
 * @returns Some numeric value.
 */
export type INumericCalculator = () => number;

/**
 * Calculator for event repetition.
 *
 * @param args   Any arguments, which will be the same as the
 *               parent event's passed args.
 * @returns Whether an event should keep repeating.
 */
export type IRepeatCalculator = (...args: any[]) => boolean;

/**
 * An event to be played, including a callback, repetition settings, and arguments.
 */
export interface ITimeEvent {
    /**
     * The time at which to call this event.
     */
    time: number;

    /**
     * Something to run when this event is triggered.
     */
    callback(): void;

    /**
     * Arguments to be passed to the callback.
     */
    args?: any[];

    /**
     * How many times this should repeat. If a Function, called for whether to repeat.
     */
    repeat?: number | IRepeatCalculator;

    /**
     * How long to wait between calls, if repeat isn't 1.
     */
    timeRepeat?: number | INumericCalculator;

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
 * Settings to initialize a new ITimeHandlr.
 */
export interface ITimeHandlrSettings {
    /**
     * Default time separation between repeated events (by default, 1).
     */
    timingDefault?: number;
}

/**
 * Scheduling for dynamically repeating or synchronized events.
 */
export interface ITimeHandlr {
    /**
     * Adds an event to be called once.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    addEvent(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        ...args: any[]
    ): ITimeEvent;

    /**
     * Adds an event to be called multiple times.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param numRepeats   How many times to run the event (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    addEventInterval(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        numRepeats?: number | IEventCallback,
        ...args: any[]
    ): ITimeEvent;

    /**
     * Adds an event interval, waiting to start until it's in sync with the time delay.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param numRepeats   How many times to run the event (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    addEventIntervalSynched(
        callback: IEventCallback,
        timeDelay: number,
        numRepeats: number | IEventCallback,
        ...args: any[]
    ): ITimeEvent;

    /**
     * Increments time and handles all now-current events.
     */
    advance(): void;

    /**
     * Cancels an event.
     *
     * @param event   Event to cancel.
     */
    cancelEvent(event: ITimeEvent): void;

    /**
     * Cancels all events.
     */
    cancelAllEvents(): void;
}
