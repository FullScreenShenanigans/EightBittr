import {
    ICurrentEvents,
    IEventCallback,
    INumericCalculator,
    ITimeEvent,
    ITimeHandlr,
    ITimeHandlrSettings,
} from "./ITimeHandlr";
import { TimeEvent } from "./TimeEvent";

/**
 * Scheduling for dynamically repeating or synchronized events.
 */
export class TimeHandlr implements ITimeHandlr {
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
    private events: ICurrentEvents;

    /**
     * Initializes a new instance of the TimeHandlr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ITimeHandlrSettings = {}) {
        this.time = 0;
        this.events = {};

        this.timingDefault =
            settings.timingDefault === undefined ? 1 : settings.timingDefault;
    }

    /**
     * Adds an event to be called once.
     *
     * @param callback   Callback to run for the event.
     * @param timeDelay   How long from now to run the callback (by default, 1).
     * @param args   Any additional arguments to pass to the callback.
     * @returns An event with the given callback and time information.
     */
    public addEvent(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        ...args: any[]
    ): ITimeEvent {
        const event: ITimeEvent = new TimeEvent(
            callback,
            1,
            this.time,
            timeDelay || 1,
            args
        );
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
    public addEventInterval(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        numRepeats?: number | IEventCallback,
        ...args: any[]
    ): ITimeEvent {
        const event: ITimeEvent = new TimeEvent(
            callback,
            numRepeats || 1,
            this.time,
            timeDelay || 1,
            args
        );
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
    public addEventIntervalSynched(
        callback: IEventCallback,
        timeDelay?: number | INumericCalculator,
        numRepeats?: number | IEventCallback,
        ...args: any[]
    ): ITimeEvent {
        timeDelay = timeDelay || 1;
        numRepeats = numRepeats || 1;

        const calcTime: number = TimeEvent.runCalculator(
            timeDelay || this.timingDefault
        );
        const entryTime: number = Math.ceil(this.time / calcTime) * calcTime;

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
    public advance(): void {
        this.time += 1;
        const currentEvents: ITimeEvent[] = this.events[this.time];

        if (!currentEvents) {
            return;
        }

        for (const currentEvent of currentEvents) {
            this.handleEvent(currentEvent);
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
        if (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            event.repeat! <= 0 ||
            event.callback.apply(this, event.args || [])
        ) {
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
    public cancelEvent(event: ITimeEvent): void {
        event.repeat = 0;
    }

    /**
     * Cancels all events.
     */
    public cancelAllEvents(): void {
        this.events = {};
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
}
