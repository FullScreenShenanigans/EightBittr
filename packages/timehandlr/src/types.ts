import type { TimeEvent } from "./TimeEvent";

/**
 * Lookup of current events, mapping times to all associated events.
 */
export type CurrentEvents = Record<number, TimeEvent[] | undefined>;

/**
 * General-purpose Function for events.
 *
 * @param args   Any arguments, passed through a TimeHandlr.
 * @returns Anything truthy to stop repetition.
 */
export type EventCallback<Args extends unknown[] = []> = (...args: Args) => any;

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
 * Settings to initialize a new TimeHandlr.
 */
export interface TimeHandlrSettings {
    /**
     * Default time separation between repeated events (by default, 1).
     */
    timingDefault?: number;
}
