import { NumericCalculator, TimeEvent, TimeHandlr } from "timehandlr";

import {
    Actor,
    ClassCalculator,
    ClassChanger,
    ClassCyclrSettings,
    TimeCycle,
    TimeCycleSettings,
} from "./types";

/**
 * Default classAdd Function.
 *
 * @param actor   The actor whose class is being modified.
 * @param className   The String to be added to the actor's class.
 */
const classAddGeneric = (actor: Actor, className: string): void => {
    actor.className += ` ${className}`;
};

/**
 * Default classRemove Function.
 *
 * @param actor   The actor whose class is being modified.
 * @param className   The String to be removed from the actor's class.
 */
const classRemoveGeneric = (actor: Actor, className: string): void => {
    actor.className = actor.className.replace(className, "");
};

/**
 * Cycles through class names using TimeHandlr events.
 */
export class ClassCyclr {
    /**
     * Adds a class to an Actor.
     */
    private readonly classAdd: ClassChanger;

    /**
     * Removes a class from an Actor.
     */
    private readonly classRemove: ClassChanger;

    /**
     * Scheduling for dynamically repeating or synchronized events.
     */
    private readonly timeHandler: TimeHandlr;

    /**
     * Initializes a new instance of the ClassCyclr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ClassCyclrSettings) {
        this.classAdd = settings.classAdd === undefined ? classAddGeneric : settings.classAdd;
        this.classRemove =
            settings.classRemove === undefined ? classRemoveGeneric : settings.classRemove;
        this.timeHandler = settings.timeHandler;
    }

    /**
     * Adds a sprite cycle (settings) for an actor, to be referenced by the given
     * name in the actor's cycles Object.
     *
     * @aram actor   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the actor's cycles.
     * @param timing   How long to wait between classes.
     */
    public addClassCycle(
        actor: Actor,
        settings: TimeCycleSettings,
        name: string,
        timing: number | NumericCalculator
    ): TimeCycle {
        if (actor.cycles === undefined) {
            actor.cycles = {};
        }

        this.cancelClassCycle(actor, name);

        // Immediately run the first class cycle, then return
        settings = actor.cycles[name] = this.setClassCycle(actor, settings, timing);
        this.cycleClass(actor, settings);

        return settings;
    }

    /**
     * Adds a synched sprite cycle (settings) for an actor, to be referenced by
     * the given name in the actor's cycles Object, and in tune with all other
     * cycles of the same period.
     *
     * @pram actor   The object whose class is to be cycled.
     * @param settings   Container for repetition settings, particularly .length.
     * @param name   Name of the cycle, to be referenced in the actor's cycles.
     * @param timing   How long to wait between classes.
     */
    public addClassCycleSynched(
        actor: Actor,
        settings: TimeCycle,
        name: string,
        timing: number | NumericCalculator
    ): TimeCycle {
        if (actor.cycles === undefined) {
            actor.cycles = {};
        }

        if (typeof name !== "undefined") {
            this.cancelClassCycle(actor, name);
        }

        // Immediately run the first class cycle, then return
        settings = actor.cycles[name] = this.setClassCycle(actor, settings, timing, true);
        this.cycleClass(actor, settings);

        return settings;
    }

    /**
     * Cancels the class cycle of an actor by finding the cycle under the actor's
     * cycles and making it appear to be empty.
     *
     * @param actor   The actor whose cycle is to be cancelled.
     * @param name   Name of the cycle to be cancelled.
     */
    public cancelClassCycle(actor: Actor, name: string): void {
        if (actor.cycles === undefined || !(name in actor.cycles)) {
            return;
        }

        const cycle: TimeCycle = actor.cycles[name];

        if (cycle.event !== undefined) {
            cycle.event.repeat = 0;
        }

        delete actor.cycles[name];
    }

    /**
     * Cancels all class cycles of an actor under the actor's cycles.
     *
     * @param actor   Actor whose cycles are to be cancelled.
     */
    public cancelAllCycles(actor: Actor): void {
        if (actor.cycles === undefined) {
            return;
        }

        for (const name in actor.cycles) {
            if (!{}.hasOwnProperty.call(actor.cycles, name)) {
                continue;
            }

            const cycle: TimeCycle = actor.cycles[name];
            cycle.length = 1;
            cycle[0] = false;
            delete actor.cycles[name];
        }
    }

    /**
     * Initialization utility for sprite cycles of actors. The settings are
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
        actor: Actor,
        settings: TimeCycle,
        timing: number | NumericCalculator,
        synched?: boolean
    ): TimeCycle {
        const timingNumber = TimeEvent.runCalculator(timing);

        // Start off before the beginning of the cycle
        settings.location = settings.oldClass = -1;

        // Let the object know to start the cycle when needed
        if (synched) {
            actor.onActorAdded = (): void => {
                settings.event = this.timeHandler.addEventIntervalSynched(
                    this.cycleClass,
                    timingNumber,
                    Infinity,
                    actor,
                    settings
                );
            };
        } else {
            actor.onActorAdded = (): void => {
                settings.event = this.timeHandler.addEventInterval(
                    this.cycleClass,
                    timingNumber,
                    Infinity,
                    actor,
                    settings
                );
            };
        }

        // If it should already start, do that
        if (actor.placed) {
            actor.onActorAdded(actor);
        }

        return settings;
    }

    /**
     * Moves an object from its current class in the sprite cycle to the next.
     * If the next object is === false, or the repeat function returns false,
     * stop by returning true.
     *
     * @param thing   The object whose class is to be cycled.
     * @param settings   A container for repetition settings, particularly .length.
     * @returns Whether the class cycle should stop (normally false).
     */
    private readonly cycleClass = (
        actor: Actor | undefined,
        settings: TimeCycle | undefined
    ): boolean => {
        // If anything has been invalidated, return true to stop
        if (!actor || actor.removed || !settings?.length) {
            return true;
        }

        // Get rid of the previous class from settings, if it's a String
        if (
            settings.oldClass !== undefined &&
            settings.oldClass !== -1 &&
            typeof settings[settings.oldClass] === "string"
        ) {
            this.classRemove(actor, settings[settings.oldClass] as string);
        }
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */

        // Move to the next location in settings, as a circular list
        settings.location = (settings.location = (settings.location ?? 0) + 1) % settings.length;

        // Current is the class, bool, or Function currently added and/or run
        const current: boolean | string | ClassCalculator = settings[settings.location];
        if (!current) {
            return false;
        }

        const name =
            current.constructor === Function
                ? (current as ClassCalculator)(actor, settings)
                : current;

        settings.oldClass = settings.location;

        // Strings are classes to be added directly
        if (typeof name === "string") {
            this.classAdd(actor, name);
            return false;
        }

        // Truthy non-String names imply a stop is required
        return !!name;
    };
}
