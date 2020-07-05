import { INumericCalculator, ITimeHandlr, TimeEvent } from "timehandlr";

import {
    IClassCalculator,
    IClassChanger,
    IClassCyclr,
    IClassCyclrSettings,
    IThing,
    ITimeCycle,
    ITimeCycleSettings,
} from "./IClassCyclr";

/**
 * Default classAdd Function.
 *
 * @param elemet   The element whose class is being modified.
 * @param className   The String to be added to the thing's class.
 */
const classAddGeneric = (thing: IThing, className: string): void => {
    thing.className += ` ${className}`;
};

/**
 * Default classRemove Function.
 *
 * @param elemen   The element whose class is being modified.
 * @param className   The String to be removed from the thing's class.
 */
const classRemoveGeneric = (thing: IThing, className: string): void => {
    thing.className = thing.className.replace(className, "");
};

/**
 * Cycles through class names using TimeHandlr events.
 */
export class ClassCyclr implements IClassCyclr {
    /**
     * Adds a class to a Thing.
     */
    private readonly classAdd: IClassChanger;

    /**
     * Removes a class from a Thing.
     */
    private readonly classRemove: IClassChanger;

    /**
     * Scheduling for dynamically repeating or synchronized events.
     */
    private readonly timeHandler: ITimeHandlr;

    /**
     * Initializes a new instance of the ClassCyclr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IClassCyclrSettings) {
        this.classAdd = settings.classAdd === undefined ? classAddGeneric : settings.classAdd;
        this.classRemove =
            settings.classRemove === undefined ? classRemoveGeneric : settings.classRemove;
        this.timeHandler = settings.timeHandler;
    }

    /**
     * Adds a sprite cycle (settings) for a thing, to be referenced by the given
     * name in the thing's cycles Object.
     *
     * @aram thing   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the thing's cycles.
     * @param timing   How long to wait between classes.
     */
    public addClassCycle(
        thing: IThing,
        settings: ITimeCycleSettings,
        name: string,
        timing: number | INumericCalculator
    ): ITimeCycle {
        if (thing.cycles === undefined) {
            thing.cycles = {};
        }

        if (name !== undefined) {
            this.cancelClassCycle(thing, name);
        }

        // Immediately run the first class cycle, then return
        settings = thing.cycles[name] = this.setClassCycle(thing, settings, timing);
        this.cycleClass(thing, settings);

        return settings;
    }

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
    public addClassCycleSynched(
        thing: IThing,
        settings: ITimeCycle,
        name: string,
        timing: number | INumericCalculator
    ): ITimeCycle {
        if (thing.cycles === undefined) {
            thing.cycles = {};
        }

        if (typeof name !== "undefined") {
            this.cancelClassCycle(thing, name);
        }

        // Immediately run the first class cycle, then return
        settings = thing.cycles[name] = this.setClassCycle(thing, settings, timing, true);
        this.cycleClass(thing, settings);

        return settings;
    }

    /**
     * Cancels the class cycle of a thing by finding the cycle under the thing's
     * cycles and making it appear to be empty.
     *
     * @param thing   The thing whose cycle is to be cancelled.
     * @param name   Name of the cycle to be cancelled.
     */
    public cancelClassCycle(thing: IThing, name: string): void {
        if (thing.cycles === undefined || !(name in thing.cycles)) {
            return;
        }

        const cycle: ITimeCycle = thing.cycles[name];

        if (cycle.event !== undefined) {
            cycle.event.repeat = 0;
        }

        delete thing.cycles[name];
    }

    /**
     * Cancels all class cycles of a thing under the thing's sycles.
     *
     * @param thing   Thing whose cycles are to be cancelled.
     */
    public cancelAllCycles(thing: IThing): void {
        if (thing.cycles === undefined) {
            return;
        }

        for (const name in thing.cycles) {
            if (!{}.hasOwnProperty.call(thing.cycles, name)) {
                continue;
            }

            const cycle: ITimeCycle = thing.cycles[name];
            cycle.length = 1;
            cycle[0] = false;
            delete thing.cycles[name];
        }
    }

    /**
     * Initialization utility for sprite cycles of things. The settings are
     * added t the right time (immediately if not synched, or on a delay if
     * synched.
     *
     * @param ting   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param timing   How often to do the cycle.
     * @param synched   Whether the animations should be synched to their period.
     * @returns The cycle containing settings and the new event.
     */
    private setClassCycle(
        thing: IThing,
        settings: ITimeCycle,
        timing: number | INumericCalculator,
        synched?: boolean
    ): ITimeCycle {
        const timingNumber = TimeEvent.runCalculator(timing);

        // Start off before the beginning of the cycle
        settings.location = settings.oldclass = -1;

        // Let the object know to start the cycle when needed
        if (synched) {
            thing.onThingAdded = (): void => {
                settings.event = this.timeHandler.addEventIntervalSynched(
                    this.cycleClass,
                    timingNumber,
                    Infinity,
                    thing,
                    settings
                );
            };
        } else {
            thing.onThingAdded = (): void => {
                settings.event = this.timeHandler.addEventInterval(
                    this.cycleClass,
                    timingNumber,
                    Infinity,
                    thing,
                    settings
                );
            };
        }

        // If it should already start, do that
        if (thing.placed) {
            thing.onThingAdded(thing);
        }

        return settings;
    }

    /**
     * Moves an object from its current class in the sprite cycle to the next.
     * If the next object is === false, or the repeat function returns false,
     * stop by rturning true.
     *
     * @param thig   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @returns Whether the class cycle should stop (normally false).
     */
    private readonly cycleClass = (thing: IThing, settings: ITimeCycle): boolean => {
        // If anything has been invalidated, return true to stop
        if (!thing || !settings || !settings.length || thing.removed) {
            return true;
        }

        // Get rid of the previous class from settings, if it's a String
        if (settings.oldclass !== -1 && typeof settings[settings.oldclass as any] === "string") {
            this.classRemove(thing, settings[settings.oldclass as any] as string);
        }

        // Move to the next location in settings, as a circular list
        settings.location = (settings.location = (settings.location || 0) + 1) % settings.length;

        // Current is the class, bool, or Function currently added and/or run
        const current: boolean | string | IClassCalculator = settings[settings.location];
        if (!current) {
            return false;
        }

        const name =
            current.constructor === Function
                ? (current as IClassCalculator)(thing, settings)
                : current;

        settings.oldclass = settings.location;

        // Strings are classes to be added directly
        if (typeof name === "string") {
            this.classAdd(thing, name);
            return false;
        }

        // Truthy non-String names imply a stop is required
        return !!name;
    };
}
