import { TimeEvent } from "./TimeEvent";
import { CurrentEvents, EventCallback, NumericCalculator, TimeHandlrSettings } from "./types";

/**
 * Scheduling for dynamically repeating or synchronized events.
 */
export class TimeHandlr {
    /**
     * Default time separation between repeated events.
     */
    private readonly timingDefault: number;

    /**
     * The current (most recently reached) time.
     */
    private time: number;

    /**
     * Events yet to be triggered, keyed by their time.
     */
    private events: CurrentEvents;

    /**
     * Initializes a new instance of the TimeHandlr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: TimeHandlrSettings = {}) {
        this.time = 0;
        this.events = {};

        this.timingDefault = settings.timingDefault === undefined ? 1 : settings.timingDefault;
    }

    /**
     * Adds an event to be called once.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    public addEvent<Args extends unknown[] = []>(
        callback: EventCallback<Args>,
        timeDelay?: number | NumericCalculator,
        ...args: Args
    ): TimeEvent {
        const event = new TimeEvent(callback, 1, this.time, timeDelay ?? 1, args);
        this.insertEvent(event);
        return event;
    }

    /**
     * Adds an event to be called multiple times.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param numRepeats   How many times to run the event (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    public addEventInterval<Args extends unknown[] = []>(
        callback: EventCallback<Args>,
        timeDelay: number | NumericCalculator = 1,
        numRepeats: number | EventCallback = 1,
        ...args: Args
    ): TimeEvent {
        const event = new TimeEvent(callback, numRepeats, this.time, timeDelay, args);
        this.insertEvent(event);
        return event;
    }

    /**
     * Adds an event interval, waiting to start until it's in sync with the time delay.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param numRepeats   How many times to run the event (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    public addEventIntervalSynched<Args extends unknown[] = []>(
        callback: EventCallback<Args>,
        timeDelay: number | NumericCalculator = 1,
        numRepeats: number | EventCallback = 1,
        ...args: Args
    ) {
        const calcTime = TimeEvent.runCalculator(timeDelay || this.timingDefault);
        const entryTime = Math.ceil(this.time / calcTime) * calcTime;

        return entryTime === this.time
            ? this.addEventInterval(callback, timeDelay, numRepeats, ...args)
            : this.addEvent(
                  this.addEventInterval,
                  entryTime - this.time,
                  callback,
                  timeDelay,
                  numRepeats,
                  ...args
              );
    }

    /**
     * Increments time and handles all now-current events.
     */
    public advance() {
        this.time += 1;
        const currentEvents = this.events[this.time];

        if (!currentEvents) {
            return;
        }

        for (const currentEvent of currentEvents) {
            this.handleEvent(currentEvent);
        }

        // Once all these events are done, ignore the memory
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.events[this.time];
    }

    /**
     * Handles a single event by calling its callback then checking its repeatability.
     * If it is repeatable, it is re-added at a later time to the events listing.
     *
     * @param event   An event to be handled.
     * @returns A new time the event is scheduled for (or undefined if it isn't).
     */
    public handleEvent(event: TimeEvent): number | undefined {
        // Events return truthy values to indicate a stop.
        if (event.repeat <= 0 || event.callback.apply(this, event.args || [])) {
            return undefined;
        }

        if (typeof event.repeat === "function") {
            // Repeat calculators return truthy values to indicate to keep going
            if (!event.repeat.apply(this, event.args || [])) {
                return undefined;
            }
        } else {
            if (!event.repeat) {
                return undefined;
            }

            event.repeat = event.repeat - 1;
            if (event.repeat <= 0) {
                return undefined;
            }
        }

        event.scheduleNextRepeat();
        this.insertEvent(event);
        return event.time;
    }

    /**
     * Cancels an event.
     *
     * @param event   Event to cancel.
     */
    public cancelEvent(event: TimeEvent) {
        event.repeat = 0;
    }

    /**
     * Cancels all events.
     */
    public cancelAllEvents() {
        this.events = {};
    }

    /**
     * Quick handler to add an event to events at a particular time. If the time
     * doesn't have any events listed, a new Array is made to hold this event.
     */
    private insertEvent(event: TimeEvent) {
        const atTime = this.events[event.time];
        if (atTime) {
            atTime.push(event);
        } else {
            this.events[event.time] = [event];
        }
    }
}
