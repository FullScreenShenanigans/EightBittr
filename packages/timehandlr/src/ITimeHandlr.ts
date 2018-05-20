/**
 * Lookup of current events, mapping times to all associated events.
 */
export interface ICurrentEvents {
    [i: number]: ITimeEvent[];
}

/**
 * Settings to create a class cycling event, commonly as a String[].
 */
export interface ITimeCycleSettings {
    /**
     * How many class phases should be cycled through.
     */
    length: number;

    /**
     * Each member of the Array-like cycle settings is a status checker,
     * className, or Function to generate a className.
     */
    [i: number]: boolean | string | IClassCalculator;
}

/**
 * Information for a currently cycling time cycle.
 */
export interface ITimeCycle extends ITimeCycleSettings {
    /**
     * The container event using this cycle.
     */
    event?: ITimeEvent;

    /**
     * Where in the classes this is currently.
     */
    location?: number;

    /**
     * The previous class' index.
     */
    oldclass?: number;
}

/**
 * A container of cycle events, such as what a Thing will store.
 */
export interface ITimeCycles {
    [i: string]: ITimeCycle;
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
 * @param args   Any arguments.
 * @returns Some numeric value.
 */
export type INumericCalculator = (...args: any[]) => number;

/**
 * Calculator for event repetition.
 *
 * @param args   Any arguments, which will be the same as the
 *               parent event's passed args.
 * @returns Whether an event should keep repeating.
 */
export type IRepeatCalculator = (...args: any[]) => boolean;

/**
 * Calculator for a class within a class cycle.
 *
 * @param args   Any arguments.
 * @returns Either a className or a value for whether this should stop.
 */
export type IClassCalculator = (thing: IThing, settings: ITimeCycle) => string | boolean;

/**
 * General-purpose Function to add or remove a class on a Thing.
 *
 * @param thing   A Thing whose class is to change.
 * @param className   The class to add or remove.
 */
export type IClassChanger = (thing: IThing, className: string) => void;

/**
 * An object that may have classes added or removed, such as in a cycle.
 */
export interface IThing {
    /**
     * Whether this is capable of animating.
     */
    alive?: boolean;

    /**
     * A summary of this Thing's current visual representation.
     */
    className: string;

    /**
     * Known currently operating cycles, keyed by name.
     */
    cycles: {
        [i: string]: ITimeCycle;
    };

    /**
     * A callback for when this is added.
     */
    onThingAdd?(thing: IThing): void;

    /**
     * Whether this is ready to have a visual display.
     */
    placed?: boolean;
}

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
     * Adds a class to a Thing (by default, String concatenation).
     */
    classAdd?: IClassChanger;

    /**
     * Removes a class from a Thing (by default, String removal).
     */
    classRemove?: IClassChanger;

    /**
     * Checks whether a cycle may be given to an object.
     */
    keyCycleCheckValidity?: string;

    /**
     * Default time separation between events in cycles (by default, 1).
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
    addEvent(callback: IEventCallback, timeDelay?: number | INumericCalculator, ...args: any[]): ITimeEvent;

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
        settings: ITimeCycle,
    ): ITimeEvent;

    /**
     * Adds a sprite cycle (settings) for a thing, to be referenced by the given
     * name in the thing's keyCycles Object.
     *
     * @param thing   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the thing's cycles.
     * @param timing   How long to wait between classes.
     */
    addClassCycle(thing: IThing, settings: ITimeCycle, name?: string, timing?: number | INumericCalculator): ITimeCycle;

    /**
     * Adds a synched sprite cycle (settings) for a thing, to be referenced by
     * the given name in the thing's keyCycles Object, and in tune with all other
     * keyCycles of the same period.
     *
     * @param thing   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the thing's cycles.
     * @param timing   How long to wait between classes.
     */
    addClassCycleSynched(thing: IThing, settings: ITimeCycle, name?: string, timing?: number | INumericCalculator): ITimeCycle;

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

    /**
     * Cancels the class cycle of a thing by finding the cycle under the thing's
     * keyCycles and making it appear to be empty.
     *
     * @param thing   The thing whose cycle is to be cancelled.
     * @param name   Name of the cycle to be cancelled.
     */
    cancelClassCycle(thing: IThing, name: string): void;

    /**
     * Cancels all class keyCycles of a thing under the thing's sycles.
     *
     * @param thing   The thing whose cycles are to be cancelled.
     */
    cancelAllCycles(thing: IThing): void;
}
