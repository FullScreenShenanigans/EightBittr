import { ITimeEvent, ITimeHandlr } from "timehandlr";

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
     * Whether this is no longer capable of animating.
     */
    removed?: boolean;

    /**
     * A summary of this Thing's current visual representation.
     */
    className: string;

    /**
     * Known currently operating cycles, keyed by name.
     */
    cycles?: ITimeCycles;

    /**
     * A callback for when this is added.
     */
    onThingAdded?(thing: this): void;

    /**
     * Whether this is ready to have a visual display.
     */
    placed?: boolean;
}

/**
 * Settings to initialize a new IClassCyclr.
 */
export interface IClassCyclrSettings {
    /**
     * Adds a class to a Thing (by default, string concatenation).
     */
    classAdd?: IClassChanger;

    /**
     * Removes a class from a Thing (by default, string removal).
     */
    classRemove?: IClassChanger;

    /**
     * Scheduling for dynamically repeating or synchronized events.
     */
    timeHandler: ITimeHandlr;
}
