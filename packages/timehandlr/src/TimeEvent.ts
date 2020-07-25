import { EventCallback, NumericCalculator, TimeEventLike } from "./types";

/**
 * An event to be played, including a callback, repetition settings, and arguments.
 */
export class TimeEvent implements TimeEventLike {
    /**
     * The time at which to call this event.
     */
    public time: number;

    /**
     * Something to run when this event is triggered.
     */
    public callback: () => void;

    /**
     * Arguments to be passed to the callback.
     */
    public args?: any[];

    /**
     * How many times this should repeat. If a Function, called for a return value.
     */
    public repeat: number | EventCallback;

    /**
     * How long to wait between calls, if repeat isn't 1.
     */
    public timeRepeat: number | NumericCalculator;

    /**
     * How many times this has been called.
     */
    public count = 0;

    /**
     * Computes a value as either a raw Number or a Function.
     *
     * @param value   The value to be computed.
     * @returns A numeric equivalent of the value.
     */
    public static runCalculator(value: number | NumericCalculator): number {
        return typeof value === "number" ? value : value();
    }

    /**
     * Initializes a new instance of the TimeEvent class.
     *
     * @param callback   A callback to be run some number of times. If it returns
     *                   truthy, repetition stops.
     * @param repeat   How many times to run the event.
     * @param time   The current time in the parent TimeHandlr.
     * @param timeRepeat   How long from now to run the callback, and how many
     *                     steps between each call.
     * @param args   Any additional arguments to pass to the callback.
     */
    public constructor(
        callback: EventCallback,
        repeat: number | NumericCalculator,
        time: number,
        timeRepeat: number | NumericCalculator,
        args?: any[]
    ) {
        this.callback = callback;
        this.repeat = repeat;
        this.timeRepeat = timeRepeat;
        this.time = time + TimeEvent.runCalculator(timeRepeat);
        this.args = args;
    }

    /**
     * Set the next call time using timeRepeat.
     *
     * @returns The new call time.
     */
    public scheduleNextRepeat(): number {
        return (this.time += TimeEvent.runCalculator(this.timeRepeat));
    }
}
