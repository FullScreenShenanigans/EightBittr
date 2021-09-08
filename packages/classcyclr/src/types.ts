import { TimeEvent, TimeHandlr } from "timehandlr";

/**
 * Settings to create a class cycling event, commonly as a String[].
 */
export interface TimeCycleSettings {
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
export interface TimeCycle extends TimeCycleSettings {
    /**
     * The container event using this cycle.
     */
    event?: TimeEvent;

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
 * A container of cycle events, such as what an Actor will store.
 */
export interface TimeCycles {
    [i: string]: TimeCycle;
}

/**
 * Calculator for a class within a class cycle.
 *
 * @param args   Any arguments.
 * @returns Either a className or a value for whether this should stop.
 */
export type ClassCalculator = (actor: Actor, settings: TimeCycle) => string | boolean;

/**
 * General-purpose Function to add or remove a class on an Actor.
 *
 * @param actor   An Actor whose class is to change.
 * @param className   The class to add or remove.
 */
export type ClassChanger = (actor: Actor, className: string) => void;

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
     * Adds a class to an Actor (by default, string concatenation).
     */
    classAdd?: ClassChanger;

    /**
     * Removes a class from an Actor (by default, string removal).
     */
    classRemove?: ClassChanger;

    /**
     * Scheduling for dynamically repeating or synchronized events.
     */
    timeHandler: TimeHandlr;
}
