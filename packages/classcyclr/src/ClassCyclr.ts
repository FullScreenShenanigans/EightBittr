import { NumericCalculator, TimeHandlr } from "timehandlr";

import { Actor, ClassCyclrSettings, ClassesList, TimeCycle } from "./types";

/**
 * Cycles through class names using TimeHandlr events.
 */
export class ClassCyclr {
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
        this.timeHandler = settings.timeHandler;
    }

    /**
     * Adds a sprite cycle (settings) for an actor, to be referenced by the given
     * name in the actor's cycles Object.
     *
     * @param actor   The object whose class is to be cycled.
     * @param classes   Classes to cycle through.
     * @param name   Name of the cycle, to be referenced in the actor's cycles.
     * @param timing   How long to wait between classes.
     */
    public addClassCycle(
        actor: Actor,
        classes: ClassesList,
        name: string,
        timing: number | NumericCalculator
    ) {
        actor.cycles ??= {};

        this.cancelClassCycle(actor, name);

        // Immediately run the first class cycle
        const cycle = (actor.cycles[name] = this.startClassCycle(actor, classes, timing));
        this.cycleClass(actor, cycle);
    }

    /**
     * Adds a synched sprite cycle (settings) for an actor, to be referenced by
     * the given name in the actor's cycles Object, and in tune with all other
     * cycles of the same period.
     *
     * @param actor   The object whose class is to be cycled.
     * @param classes   Classes to cycle through.
     * @param name   Name of the cycle, to be referenced in the actor's cycles.
     * @param timing   How long to wait between classes.
     */
    public addClassCycleSynched(
        actor: Actor,
        classes: ClassesList,
        name: string,
        timing: number | NumericCalculator
    ) {
        actor.cycles ??= {};

        this.cancelClassCycle(actor, name);

        // Immediately synch -and potentially run- the first class cycle
        const cycle = (actor.cycles[name] = this.startClassCycle(actor, classes, timing, true));
        this.cycleClass(actor, cycle);
    }

    /**
     * Cancels the class cycle of an actor by finding the cycle under the actor's
     * cycles and making it appear to be empty.
     *
     * @param actor   The actor whose cycle is to be cancelled.
     * @param name   Name of the cycle to be cancelled.
     */
    public cancelClassCycle(actor: Actor, name: string) {
        if (actor.cycles === undefined || !(name in actor.cycles)) {
            return;
        }

        const cycle = actor.cycles[name];

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
    public cancelAllCycles(actor: Actor) {
        if (actor.cycles === undefined) {
            return;
        }

        for (const name in actor.cycles) {
            this.cancelClassCycle(actor, name);
        }
    }

    /**
     * Initialization utility for sprite cycles of actors. The settings are
     * added to the right time (immediately if not synched, or on a delay if
     * synched.
     *
     * @param actor   The object whose class is to be cycled.
     * @param classes   Classes to cycle through.
     * @param timing   How often to do the cycle.
     * @param synched   Whether the animations should be synched to their period.
     * @returns The cycle containing settings and the new event.
     */
    private startClassCycle(
        actor: Actor,
        classes: ClassesList,
        timing: number | NumericCalculator,
        synched?: boolean
    ) {
        const cycle: TimeCycle = {
            classes,
            location: -1,
        };

        // Let the object know to start the cycle when needed
        actor.onActorAdded = () => {
            cycle.event = synched
                ? this.timeHandler.addEventIntervalSynched(
                      this.cycleClass,
                      timing,
                      Infinity,
                      actor,
                      cycle
                  )
                : this.timeHandler.addEventInterval(
                      this.cycleClass,
                      timing,
                      Infinity,
                      actor,
                      cycle
                  );
        };

        // If it should already start, do that
        if (actor.placed) {
            actor.onActorAdded(actor);
        }

        return cycle;
    }

    /**
     * Moves an object from its current class in the sprite cycle to the next.
     * If the next object is === false, or the repeat function returns false,
     * stop by returning true.
     *
     * @param actor   The object whose class is to be cycled.
     * @param cycle   A currently cycling time cycle.
     * @returns Whether the class cycle should stop (normally false).
     */
    private readonly cycleClass = (actor: Actor | undefined, cycle: TimeCycle) => {
        // If anything has been invalidated, return true to stop
        if (!actor || actor.removed || !cycle.classes.length) {
            return true;
        }

        // Get rid of the previous class from settings
        if (cycle.previouslyAdded !== undefined) {
            actor.className = actor.className.startsWith(cycle.previouslyAdded)
                ? actor.className.slice(cycle.previouslyAdded.length + 1)
                : actor.className.replace(` ${cycle.previouslyAdded}`, "");
        }

        // Move to the next location in settings, as a circular list
        cycle.location = ((cycle.location ?? 0) + 1) % cycle.classes.length;

        // Current is the boolean, class, or Function currently added and/or run
        const current = cycle.classes[cycle.location];
        if (!current) {
            return false;
        }

        const nameNew = typeof current === "function" ? current(actor, cycle) : current;

        // Strings are classes to be added directly
        if (typeof nameNew === "string") {
            actor.className = actor.className === "" ? nameNew : `${actor.className} ${nameNew}`;
            cycle.previouslyAdded = nameNew;
            return false;
        }

        // Truthy non-string names imply a stop is required
        cycle.previouslyAdded = undefined;
        return !!nameNew;
    };
}
