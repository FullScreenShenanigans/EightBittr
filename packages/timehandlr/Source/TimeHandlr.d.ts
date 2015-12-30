declare module TimeHandlr {
    export interface IEventCallback {
        (...args: any[]): any;
    }

    export interface IRepeatCalculator {
        (...args: any[]): boolean;
    }

    export interface INumericCalculator {
        (...args: any[]): number;
    }

    export interface IClassCalculator {
        (...args: any[]): string | boolean;
    }

    export interface ICurrentEvents {
        [i: number]: TimeEvent[];
    }

    export interface ITimeCycle {
        length: number;
        event?: ITimeEvent;
    }

    export interface ISyncSettings extends ITimeCycle {
        location?: number;
        oldclass?: number;
        [i: number]: string | IClassCalculator;
    }

    export interface ITimeCycles {
        [i: string]: ITimeCycle;
    }

    export interface IClassChanger {
        (thing: any, className: string): void;
    }

    export interface IThing { }

    export interface ITimeEvent {
        /**
         * The time at which to call this event.
         */
        time: number;

        /**
         * Something to run when this event is triggered.
         */
        callback: Function;

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
    }

    /**
     * Settings to initialize a new ITimeHandlr.
     */
    export interface ITimeHandlrSettings {
        /**
         * The default time separation between events in cycles (by default, 1).
         */
        timingDefault?: number;

        /**
         * Attribute name to store listings of cycles in objects (by default, 
         * "cycles").
         */
        keyCycles?: string;

        /**
         * Atribute name to store class name in objects (by default, "className").
         */
        keyClassName?: string;

        /**
         * Key to check for a callback before a cycle starts in objects (by default,
         * "onClassCycleStart").
         */
        keyOnClassCycleStart?: string;

        /**
         * Key to check for a callback after a cycle starts in objects (by default,
         * "doClassCycleStart").
         */
        keyDoClassCycleStart?: string;

        /**
         * Optional attribute to check for whether a cycle may be given to an 
         * object (if not given, ignored).
         */
        keyCycleCheckValidity?: string;

        /**
         * Whether a copy of settings should be made in setClassCycle.
         */
        copyCycleSettings?: boolean;

        /**
         * Function to add a class to a Thing (by default, String concatenation).
         */
        classAdd?: IClassChanger;

        /**
         * Function to remove a class from a Thing (by default, String removal).
         */
        classRemove?: IClassChanger;
    }

    /**
     * A timed events library providing a flexible alternative to setTimeout 
     * and setInterval that respects pauses and resumes. Events are assigned 
     * integer timestamps, and can be set to repeat multiple times.
     */
    export interface ITimeHandlr {
        /**
         * @returns The current time.
         */
        getTime(): number;

        /**
         * @returns The catalog of events, keyed by their time triggers.
         */
        getEvents(): ICurrentEvents;

        /**
         * Adds an event in a manner similar to setTimeout, though any arguments 
         * past the timeDelay will be passed to the event callback. The added event
         * is inserted into the events container and set to only repeat once.
         * 
         * @param callback   A callback to be run after some time.
         * @param timeDelay   How long from now to run the callback (by default, 1).
         * @param args   Any additional arguments to pass to the callback.
         * @returns An event with the given callback and time information.
         */
        addEvent(callback: IEventCallback, timeDelay?: number | INumericCalculator, ...args: any[]): ITimeEvent;

        /**
         * Adds an event in a manner similar to setInterval, though any arguments past
         * the numRepeats will be passed to the event callback. The added event is 
         * inserted into the events container and is set to repeat a numRepeat amount 
         * of times, though if the callback returns true, it will stop.
         * 
         * @param callback   A callback to be run some number of times. If it returns 
         *                   truthy, repetition stops.
         * @param timeDelay   How long from now to run the callback, and how many
         *                    steps between each call (by default, 1).
         * @param numRepeats   How many times to run the event. Infinity is an
         *                     acceptable option (by default, 1).
         * @param args   Any additional arguments to pass to the callback.
         * @returns An event with the given callback and time information.
         */
        addEventInterval(
            callback: IEventCallback,
            timeDelay?: number | INumericCalculator,
            numRepeats?: number | IEventCallback,
            ...args: any[]): ITimeEvent;

        /**
         * A wrapper around addEventInterval that delays starting the event
         * until the current time is modular with the repeat delay, so that all 
         * event intervals synched to the same period are in unison.
         * 
         * @param callback   A callback to be run some number of times. If it returns 
         *                   truthy, repetition stops.
         * @param timeDelay   How long from now to run the callback, and how many 
         *                    steps between each call (by default, 1).
         * @param numRepeats   How many times to run the event. Infinity is an
         *                     acceptable option (by default, 1).
         * @param thing   Some data container to be manipulated.
         * @param settings   Repetition settings, particularly .length.
         */
        addEventIntervalSynched(
            callback: IEventCallback,
            timeDelay: number,
            numRepeats: number | IEventCallback,
            settings: ISyncSettings): ITimeEvent;

        /**
         * Adds a sprite cycle (settings) for a thing, to be referenced by the given
         * name in the thing's keyCycles Object. The sprite cycle switches the thing's
         * class using classAdd and classRemove (which can be given by the user in
         * reset, but default to internally defined Functions).
         * 
         * @param thing   The object whose class is to be cycled.
         * @param settings   A container for repetition settings, particularly .length.
         * @param name   The name of the cycle, to be referenced in the thing's cycles.
         * @param timing   A way to determine how often to do the cycle.
         */
        addClassCycle(thing: IThing, settings: ISyncSettings, name: string, timing: number | INumericCalculator): ITimeCycle;

        /**
         * Adds a synched sprite cycle (settings) for a thing, to be referenced by
         * the given name in the thing's keyCycles Object, and in tune with all other
         * keyCycles of the same period. The sprite cycle switches the thing's class 
         * using classAdd and classRemove (which can be given by the user in reset,
         * but default to internally defined Functions).
         * 
         * @param thing   The object whose class is to be cycled.
         * @param settings   A container for repetition settings, particularly .length.
         * @param name   The name of the cycle, to be referenced in the thing's cycles.
         * @param timing   A way to determine how often to do the cycle.
         */
        addClassCycleSynched(thing: IThing, settings: ISyncSettings, name: string, timing: number | INumericCalculator): ITimeCycle;

        /**
         * Increments time and handles all now-current events.
         */
        handleEvents(): void;

        /**
         * Handles a single event by calling its callback then checking its repeatability.
         * If it is repeatable, it is re-added at a later time to the events listing.
         *
         * @param event   An event to be handled.
         * @returns A new time the event is scheduled for (or undefined if it isn't).
         */
        handleEvent(event: ITimeEvent): number;

        /**
         * Cancels an event by making its .repeat value 0.
         * 
         * @param event   The event to cancel.
         */
        cancelEvent(event: ITimeEvent): void;

        /**
         * Cancels all events by clearing the events Object.
         */
        cancelAllEvents(): void;

        /**
         * Cancels the class cycle of a thing by finding the cycle under the thing's
         * keyCycles and making it appear to be empty.
         * 
         * @param thing   The thing whose cycle is to be cancelled.
         * @param name   The name of the cycle to be cancelled.
         */
        cancelClassCycle(thing: IThing, name: string): void;

        /**
         * Cancels all class keyCycles of a thing under the thing's sycles.
         * 
         * @param thing   The thing whose cycles are to be cancelled.
         */
        cancelAllCycles(thing: IThing): void;
    }
}
