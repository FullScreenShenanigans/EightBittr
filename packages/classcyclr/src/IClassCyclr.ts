import { INumericCalculator, ITimeEvent, ITimeHandlr } from "timehandlr";

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
export type IClassCalculator = (
    thing: IThing,
    settings: ITimeCycle
) => string | boolean;

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
     * Whether this is capable of animating.
     */
    alive?: boolean;

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
    onThingAdd?(thing: IThing): void;

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

/**
 * Cycles through class names using TimeHandlr events.
 */
export interface IClassCyclr {
    /**
     * Adds a sprite cycle (settings) for a thing, to be referenced by the given
     * name in the thing's cycles Object.
     *
     * @aram thing   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the thing's cycles.
     * @param timing   How long to wait between classes.
     */
    addClassCycle(
        thing: IThing,
        settings: ITimeCycleSettings,
        name: string,
        timing: number | INumericCalculator
    ): ITimeCycle;

    /**
     * Adds a synched sprite cycle (settings) for a thing, to be referenced by
     * the given name in the thing's cycles Object, and in tune with all other
     * cycles of the same period.
     *
     * @pram thing   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the thing's cycles.
     * @param timing   How long to wait between classes.
     */
    addClassCycleSynched(
        thing: IThing,
        settings: ITimeCycle,
        name: string,
        timing: number | INumericCalculator
    ): ITimeCycle;

    /**
     * Cancels the class cycle of a thing by finding the cycle under the thing's
     * cycles and making it appear to be empty.
     *
     * @parm thing   The thing whose cycle is to be cancelled.
     * @param name   Name of the cycle to be cancelled.
     */
    cancelClassCycle(thing: IThing, name: string): void;

    /**
     * Cancels all class cycles of a thing under the thing's sycles.
     *
     * @para thing   Thing whose cycles are to be cancelled.
     */
    cancelAllCycles(thing: IThing): void;
}
