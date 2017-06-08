import { IEventCallback, INumericCalculator, ITimeEvent } from "./ITimeHandlr";

/**
 * An event to be played, including a callback, repetition settings, and arguments.
 */
export class TimeEvent implements ITimeEvent {
    /**
     * The time at which to call this event.
     */
    public time: number;

    /**
     * Something to run when this event is triggered.
     */
    public callback: Function;

    /**
     * Arguments to be passed to the callback.
     */
    public args?: any[];

    /**
     * How many times this should repeat. If a Function, called for a return value.
     */
    public repeat: number | IEventCallback;

    /**
     * How long to wait between calls, if repeat isn't 1.
     */
    public timeRepeat: number | INumericCalculator;

    /**
     * How many times this has been called.
     */
    public count: number = 0;

    /**
     * Computes a value as either a raw Number or a Function.
     *
     * @param value   The value to be computed.
     * @param args   Any additional arguments, if value is a Function.
     * @returns A numeric equivalent of the value.
     */
    public static runCalculator(value: number | INumericCalculator, ...args: any[]): number {
        return (typeof value === "number")
            ? value
            : value(...args);
    }

    /**
     * Initializes a new instance of the Event class.
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
        callback: IEventCallback,
        repeat: number | INumericCalculator,
        time: number,
        timeRepeat: number | INumericCalculator,
        args?: any[]) {
        this.callback = callback;
        this.repeat = repeat;
        this.timeRepeat = timeRepeat;
        this.time = time + TimeEvent.runCalculator(timeRepeat, this);
        this.args = args;
    }

    /**
     * Set the next call time using timeRepeat.
     *
     * @returns The new call time.
     */
    public scheduleNextRepeat(): number {
        return this.time += TimeEvent.runCalculator(this.timeRepeat);
    }
}
