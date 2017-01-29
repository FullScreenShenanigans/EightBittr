import {
    IClassCalculator, IClassChanger, ICurrentEvents, IEventCallback, INumericCalculator, IRepeatCalculator,
    IThing, ITimeCycle, ITimeCycles, ITimeCycleSettings, ITimeEvent, ITimeHandlr, ITimeHandlrSettings
} from "./ITimeHandlr";
import { TimeEvent } from "./TimeEvent";

/**
 * A flexible, pausable alternative to setTimeout.
 */
export class TimeHandlr implements ITimeHandlr {
    /**
     * The current (most recently reached) time.
     */
    private time: number;

    /**
     * Lookup table of all events yet to be triggered, keyed by their time.
     */
    private events: ICurrentEvents;

    /**
     * The default time separation between events in cycles.
     */
    private timingDefault: number;

    /**
     * Attribute name to store listings of cycles in objects.
     */
    private keyCycles: string;

    /**
     * Attribute name to store class name in objects.
     */
    private keyClassName: string;

    /**
     * Key to check for a callback before a cycle starts in objects.
     */
    private keyOnClassCycleStart: string;

    /**
     * Key to check for a callback after a cycle starts in objects.
     */
    private keyDoClassCycleStart: string;

    /**
     * Optional attribute to check for whether a cycle may be given to an
     * object.
     */
    private keyCycleCheckValidity?: string;

    /**
     * Whether a copy of settings should be made in setClassCycle.
     */
    private copyCycleSettings: boolean;

    /**
     * Function to add a class to a Thing.
     */
    private classAdd: IClassChanger;

    /**
     * Function to remove a class from a Thing.
     */
    private classRemove: IClassChanger;

    /**
     * Initializes a new instance of the TimeHandlr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ITimeHandlrSettings = {}) {
        this.time = 0;
        this.events = {};

        this.timingDefault = settings.timingDefault || 1;

        this.keyCycles = settings.keyCycles || "cycles";
        this.keyClassName = settings.keyClassName || "className";
        this.keyOnClassCycleStart = settings.keyOnClassCycleStart || "onClassCycleStart";
        this.keyDoClassCycleStart = settings.keyDoClassCycleStart || "doClassCycleStart";
        this.keyCycleCheckValidity = settings.keyCycleCheckValidity;

        this.copyCycleSettings = typeof settings.copyCycleSettings === "undefined" ? true : settings.copyCycleSettings;

        this.classAdd = settings.classAdd || this.classAddGeneric;
        this.classRemove = settings.classRemove || this.classRemoveGeneric;
    }

    /**
     * @returns The current time.
     */
    public getTime(): number {
        return this.time;
    }

    /**
     * @returns The catalog of events, keyed by their time triggers.
     */
    public getEvents(): ICurrentEvents {
        return this.events;
    }

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
    public addEvent(callback: IEventCallback, timeDelay?: number | INumericCalculator, ...args: any[]): ITimeEvent {
        const event: ITimeEvent = new TimeEvent(callback, 1, this.time, timeDelay || 1, args);
        this.insertEvent(event);
        return event;
    }

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
    public addEventInterval(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        numRepeats?: number | IEventCallback,
        ...args: any[]): ITimeEvent {
        const event: ITimeEvent = new TimeEvent(callback, numRepeats || 1, this.time, timeDelay || 1, args);
        this.insertEvent(event);
        return event;
    }

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
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    public addEventIntervalSynched(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        numRepeats?: number | IEventCallback,
        ...args: any[]): ITimeEvent {
        timeDelay = timeDelay || 1;
        numRepeats = numRepeats || 1;

        const calcTime: number = TimeEvent.runCalculator(timeDelay || this.timingDefault);
        const entryTime: number = Math.ceil(this.time / calcTime) * calcTime;

        return entryTime === this.time
            ? this.addEventInterval(callback, timeDelay, numRepeats, ...args)
            : this.addEvent(this.addEventInterval, entryTime - this.time, callback, timeDelay, numRepeats, ...args);
    }

    /**
     * Adds a sprite cycle (settings) for a thing, to be referenced by the given
     * name in the thing's cycles Object.
     * 
     * @param thing   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @param name   The name of the cycle, to be referenced in the thing's cycles.
     * @param timing   A way to determine how long to wait between classes.
     */
    public addClassCycle(thing: IThing, settings: ITimeCycleSettings, name?: string, timing?: number | INumericCalculator): ITimeCycle {
        if (!thing.cycles) {
            thing.cycles = {};
        }

        if (typeof name !== "undefined") {
            this.cancelClassCycle(thing, name);
        }

        settings = thing.cycles[name || "0"] = this.setClassCycle(thing, settings, timing);

        // Immediately run the first class cycle, then return
        this.cycleClass(thing, settings);
        return settings;
    }

    /**
     * Adds a synched sprite cycle (settings) for a thing, to be referenced by
     * the given name in the thing's cycles Object, and in tune with all other
     * cycles of the same period.
     * 
     * @param thing   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @param name   The name of the cycle, to be referenced in the thing's cycles.
     * @param timing   A way to determine how long to wait between classes.
     */
    public addClassCycleSynched(thing: IThing, settings: ITimeCycle, name?: string, timing?: number | INumericCalculator): ITimeCycle {
        if (!thing.cycles) {
            thing.cycles = {};
        }

        if (typeof name !== "undefined") {
            this.cancelClassCycle(thing, name);
        }

        settings = thing.cycles[name || "0"] = this.setClassCycle(thing, settings, timing, true);

        // Immediately run the first class cycle, then return
        this.cycleClass(thing, settings);
        return settings;
    }

    /**
     * Increments time and handles all now-current events.
     */
    public handleEvents(): void {
        this.time += 1;
        const currentEvents: ITimeEvent[] = this.events[this.time];

        if (!currentEvents) {
            return;
        }

        for (let i: number = 0; i < currentEvents.length; i += 1) {
            this.handleEvent(currentEvents[i]);
        }

        // Once all these events are done, ignore the memory
        delete this.events[this.time];
    }

    /**
     * Handles a single event by calling its callback then checking its repeatability.
     * If it is repeatable, it is re-added at a later time to the events listing.
     *
     * @param event   An event to be handled.
     * @returns A new time the event is scheduled for (or undefined if it isn't).
     */
    public handleEvent(event: ITimeEvent): number | undefined {
        // Events return truthy values to indicate a stop.
        if (event.repeat <= 0 || event.callback.apply(this, event.args)) {
            return undefined;
        }

        if (typeof event.repeat === "function") {
            // Repeat calculators return truthy values to indicate to keep going
            if (!(event.repeat as IRepeatCalculator).apply(this, event.args)) {
                return undefined;
            }
        } else {
            if (!event.repeat) {
                return undefined;
            }

            event.repeat = event.repeat as number - 1;
            if (event.repeat <= 0) {
                return undefined;
            }
        }

        event.scheduleNextRepeat();
        this.insertEvent(event);
        return event.time;
    }

    /**
     * Cancels an event by making its .repeat value 0.
     * 
     * @param event   The event to cancel.
     */
    public cancelEvent(event: ITimeEvent): void {
        event.repeat = 0;
    }

    /**
     * Cancels all events by clearing the events Object.
     */
    public cancelAllEvents(): void {
        this.events = {};
    }

    /**
     * Cancels the class cycle of a thing by finding the cycle under the thing's
     * cycles and making it appear to be empty.
     * 
     * @param thing   The thing whose cycle is to be cancelled.
     * @param name   The name of the cycle to be cancelled.
     */
    public cancelClassCycle(thing: IThing, name: string): void {
        if (!thing.cycles || !thing.cycles[name]) {
            return;
        }

        const cycle: ITimeCycle = thing.cycles[name];
        cycle.event!.repeat = 0;

        delete thing.cycles[name];
    }

    /**
     * Cancels all class cycles of a thing under the thing's sycles.
     * 
     * @param thing   The thing whose cycles are to be cancelled.
     */
    public cancelAllCycles(thing: IThing): void {
        const keyCycles: ITimeCycles = thing.cycles;

        for (const name in keyCycles) {
            if (!keyCycles.hasOwnProperty(name)) {
                continue;
            }

            const cycle: ITimeCycle = keyCycles[name];
            cycle.length = 1;
            cycle[0] = false;
            delete keyCycles[name];
        }
    }

    /**
     * Initialization utility for sprite cycles of things. The settings are 
     * added at the right time (immediately if not synched, or on a delay if 
     * synched).
     * 
     * @param thing   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @param timing   A way to determine how often to do the cycle.
     * @param synched   Whether the animations should be synched to their period.
     * @returns The cycle containing settings and the new event.
     */
    private setClassCycle(thing: IThing, settings: ITimeCycle, timing?: number | INumericCalculator, synched?: boolean): ITimeCycle {
        timing = TimeEvent.runCalculator(timing || this.timingDefault);

        if (this.copyCycleSettings) {
            settings = this.makeSettingsCopy(settings);
        }

        // Start off before the beginning of the cycle
        settings.location = settings.oldclass = -1;

        // Let the object know to start the cycle when needed
        if (synched) {
            thing.onThingAdd = (): void => {
                const calcTime: number = settings.length * (timing as number);
                const entryDelay: number = Math.ceil(this.time / calcTime) * calcTime - this.time;
                let event: ITimeEvent;

                if (entryDelay === 0) {
                    event = this.addEventInterval(this.cycleClass, timing, Infinity, thing, settings);
                } else {
                    event = this.addEvent(this.addEventInterval, entryDelay, this.cycleClass, timing, Infinity, thing, settings);
                }

                settings.event = event;
            };
        } else {
            thing.onThingAdd = (): void => {
                settings.event = this.addEventInterval(this.cycleClass, timing, Infinity, thing, settings);
            };
        }

        // If it should already start, do that
        if (thing.placed) {
            thing.onThingAdd(thing);
        }

        return settings;
    }

    /**
     * Moves an object from its current class in the sprite cycle to the next.
     * If the next object is === false, or the repeat function returns false, 
     * stop by returning true.
     * 
     * @param thing   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @returns Whether the class cycle should stop (normally false).
     */
    private cycleClass(thing: IThing, settings: ITimeCycle): boolean {
        // If anything has been invalidated, return true to stop
        if (!thing || !settings || !settings.length || (this.keyCycleCheckValidity && !thing.alive)) {
            return true;
        }

        // Get rid of the previous class from settings, if it's a String
        if (settings.oldclass !== -1 && typeof settings[settings.oldclass as any] === "string") {
            this.classRemove(thing, settings[settings.oldclass as any] as string);
        }

        // Move to the next location in settings, as a circular list
        settings.location = (settings.location += 1) % settings.length;

        // Current is the class, bool, or Function currently added and/or run
        const current: boolean | string | IClassCalculator = settings[settings.location];
        if (!current) {
            return false;
        }

        let name: string | boolean;
        if (current.constructor === Function) {
            name = (current as IClassCalculator)(thing, settings);
        } else {
            name = current as string;
        }

        settings.oldclass = settings.location;

        // Strings are classes to be added directly
        if (typeof name === "string") {
            this.classAdd(thing, name);
            return false;
        } else {
            // Truthy non-String names imply a stop is required
            return !!name;
        }
    }

    /**
     * Quick handler to add an event to events at a particular time. If the time
     * doesn't have any events listed, a new Array is made to hold this event.
     */
    private insertEvent(event: ITimeEvent): void {
        if (!this.events[event.time]) {
            this.events[event.time] = [event];
        } else {
            this.events[event.time].push(event);
        }
    }

    /**
     * Creates a copy of an Object/Array. This is useful for passing settings
     * Objects by value instead of reference.
     * 
     * @param original   The original object.
     * @returns A copy of the original object.
     */
    private makeSettingsCopy(original: any): any {
        const output: any = new original.constructor();

        for (const i in original) {
            if (original.hasOwnProperty(i)) {
                output[i] = original[i];
            }
        }

        return output;
    }

    /**
     * Default classAdd Function.
     * 
     * @param element   The element whose class is being modified.
     * @param className   The String to be added to the thing's class.
     */
    private classAddGeneric(thing: IThing, className: string): void {
        thing.className += " " + className;
    }

    /**
     * Default classRemove Function.
     * 
     * @param element   The element whose class is being modified.
     * @param className   The String to be removed from the thing's class.
     */
    private classRemoveGeneric(thing: IThing, className: string): void {
        thing.className = thing.className.replace(className, "");
    }
}
