import { TimeEvent, TimeHandlr } from "timehandlr";

/**
 * Classes to cycle through, commonly as a string[].
 */
export interface ClassesList {
    /**
     * How many class phases should be cycled through.
     */
    length: number;

    /**
     * Each member of the Array-like cycle settings is a status checker,
     * className, or Function to generate a className.
     */
    [i: number]: boolean | string | ClassCalculator;
}

/**
 * Information for a currently cycling time cycle.
 */
export interface TimeCycle {
    /**
     * Classes to cycle through.
     */
    classes: ClassesList;

    /**
     * The container event using this cycle.
     */
    event?: TimeEvent;

    /**
     * Where in the classes this is currently.
     */
    location?: number;

    /**
     * The class added by the previous cycle, if after a first cycle.
     */
    previouslyAdded?: string;
}

/**
 * A container of cycle events, such as what an Actor will store.
 */
export type TimeCycles = Record<string, TimeCycle>;

/**
 * Calculator for a class within a class cycle.
 *
 * @param args   Any arguments.
 * @returns Either a className or a value for whether this should stop.
 */
export type ClassCalculator = (actor: Actor, settings: TimeCycle) => string | boolean;

/**
 * An object that may have classes added or removed, such as in a cycle.
 */
export interface Actor {
    /**
     * Whether this is no longer capable of animating.
     */
    removed?: boolean;

    /**
     * A summary of this Actor's current visual representation.
     */
    className: string;

    /**
     * Known currently operating cycles, keyed by name.
     */
    cycles?: TimeCycles;

    /**
     * A callback for when this is added.
     */
    onActorAdded?(actor: this): void;

    /**
     * Whether this is ready to have a visual display.
     */
    placed?: boolean;
}

/**
 * Settings to initialize a new ClassCyclr.
 */
export interface ClassCyclrSettings {
    /**
     * Scheduling for dynamically repeating or synchronized events.
     */
    timeHandler: TimeHandlr;
}
