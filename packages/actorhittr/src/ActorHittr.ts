import {
    GlobalCheck,
    GroupHitList,
    HitCallback,
    HitCheck,
    HitsCheck,
    Actor,
    ActorFunction,
    ActorFunctionContainer,
    ActorFunctionContainerGroup,
    ActorFunctionGenerator,
    ActorFunctionGeneratorContainerGroup,
    ActorHittrSettings,
} from "./types";

/**
 * Automation for physics collisions and reactions.
 */
export class ActorHittr {
    /**
     * For each group name, the names of other groups it is allowed to hit.
     */
    private readonly groupHitLists: GroupHitList;

    /**
     * Function generator for globalChecks.
     */
    private readonly globalCheckGenerator?: ActorFunctionGenerator<GlobalCheck>;

    /**
     * Function generators for hitChecks.
     */
    private readonly hitCheckGenerators: ActorFunctionGeneratorContainerGroup<HitCheck>;

    /**
     * Function generators for HitCallbacks.
     */
    private readonly hitCallbackGenerators: ActorFunctionGeneratorContainerGroup<HitCallback>;

    /**
     * Check Functions for Actors within groups to see if they're able to
     * collide in the first place.
     */
    private readonly generatedGlobalChecks: ActorFunctionContainer<GlobalCheck>;

    /**
     * Collision detection Functions to check two Actors for collision.
     */
    private readonly generatedHitChecks: ActorFunctionContainerGroup<HitCheck>;

    /**
     * Hit Function callbacks for when two Actors do collide.
     */
    private readonly generatedHitCallbacks: ActorFunctionContainerGroup<HitCallback>;

    /**
     * Hits checkers for when an Actor should have its hits detected.
     */
    private readonly generatedHitsChecks: ActorFunctionContainer<HitsCheck>;

    /**
     * Initializes a new instance of the ActorHittr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: ActorHittrSettings = {}) {
        this.globalCheckGenerator = settings.globalCheckGenerator;
        this.hitCheckGenerators = settings.hitCheckGenerators || {};
        this.hitCallbackGenerators = settings.hitCallbackGenerators || {};

        this.generatedHitChecks = {};
        this.generatedHitCallbacks = {};
        this.generatedGlobalChecks = {};
        this.generatedHitsChecks = {};

        this.groupHitLists = this.generateGroupHitLists(this.hitCheckGenerators);
    }

    /**
     * Caches global and hits checks for the given type if they do not yet exist
     * and have their generators defined
     *
     * @param groupName   What classification of Actor to cache hits for.
     * @param typeName   The specific Actor title to cache hits for.
     */
    public cacheChecksForType(groupName: string, typeName: string): void {
        if (
            !{}.hasOwnProperty.call(this.generatedGlobalChecks, groupName) &&
            this.globalCheckGenerator
        ) {
            this.generatedGlobalChecks[typeName] = this.globalCheckGenerator();
        }

        if (
            !{}.hasOwnProperty.call(this.generatedHitsChecks, groupName) &&
            {}.hasOwnProperty.call(this.hitCheckGenerators, groupName)
        ) {
            this.generatedHitsChecks[typeName] = this.generateHitsCheck(groupName);
        }
    }

    /**
     * Checks all hits for an Actor using its generated hits check.
     *
     * @param actor   The Actor to have hits checked.
     */
    public checkHitsForActor(actor: Actor): void {
        this.generatedHitsChecks[actor.title](actor);
    }

    /**
     * Checks whether two Actors are hitting.
     *
     * @param actor   The primary Actor that may be hitting other.
     * @param other   The secondary Actor that may be being hit by actor.
     * @returns Whether the two Actors are hitting.
     */
    public checkHitForActors(actor: Actor, other: Actor): boolean {
        return !!this.runActorsFunctionSafely(
            this.generatedHitChecks,
            actor,
            other,
            this.hitCheckGenerators
        );
    }

    /**
     * Reacts to two Actors hitting.
     *
     * @param actor   The primary Actor that is hitting other.
     * @param other   The secondary Actor that is being hit by actor.
     */
    public runHitCallbackForActors(actor: Actor, other: Actor): void {
        this.runActorsFunctionSafely(
            this.generatedHitCallbacks,
            actor,
            other,
            this.hitCallbackGenerators
        );
    }

    /**
     * Function generator for a hits check for a specific Actor type.
     *
     * @param groupName   The type of the Actors to generate for.
     * @returns A Function that can check all hits for an Actor of the given type.
     */
    private generateHitsCheck(groupName: string): HitsCheck {
        /**
         * Collision detection Function for an Actor. For each Quadrant the Actor
         * is in, for all groups within that Function that the Actor's group is
         * allowed to collide with, it is checked for collision with the Actors
         * in that group. For each Actor it does collide with, the appropriate
         * hit Function is called.
         *
         * @param actor   An Actor to check collision detection for.
         */
        return (actor: Actor): void => {
            // Don't do anyactor if the actor shouldn't be checking
            if (
                {}.hasOwnProperty.call(this.generatedGlobalChecks, groupName) &&
                !this.generatedGlobalChecks[groupName](actor)
            ) {
                return;
            }

            // For each quadrant the Actor is in...
            for (let i = 0; i < actor.numQuadrants; i += 1) {
                // For each group within that quadrant the Actor may collide with...
                for (const groupName of this.groupHitLists[actor.groupType]) {
                    // For each other Actor in the group that should be checked...
                    for (let j = 0; j < actor.quadrants[i].numactors[groupName]; j += 1) {
                        const other = actor.quadrants[i].actors[groupName][j];
                        // If they are the same, breaking to prevent double hits
                        if (actor === other) {
                            break;
                        }

                        // Do nothing if other can't collide in the first place
                        if (!this.generatedGlobalChecks[other.title](other)) {
                            continue;
                        }

                        // If they do hit, call the corresponding hitCallback
                        if (this.checkHitForActors(actor, other)) {
                            this.runHitCallbackForActors(actor, other);
                        }
                    }
                }
            }
        };
    }

    /**
     * Runs the Function in the group that maps to the two Actors' types. If it doesn't
     * yet exist, it is created.
     *
     * @param group   The group of Functions to use.
     * @param actor   The primary Actor reacting to other.
     * @param other   The secondary Actor that actor is reacting to.
     * @returns The result of the ActorFunction from the group.
     */
    private runActorsFunctionSafely(
        group: ActorFunctionContainerGroup<ActorFunction>,
        actor: Actor,
        other: Actor,
        generators: ActorFunctionGeneratorContainerGroup<ActorFunction>
    ): boolean | void {
        const typeActor = actor.title;
        const typeOther = other.title;
        let container = group[typeActor];
        if (container === undefined) {
            container = group[typeActor] = {};
        }

        let check = container[typeOther];
        if (check === undefined) {
            check = container[typeOther] = generators[actor.groupType][other.groupType]();
        }

        return (check as HitCheck)(actor, other);
    }

    /**
     * Generates the list of group names each group is allowed to hit.
     *
     * @param group   A summary of group containers.
     */
    private generateGroupHitLists(
        group: ActorFunctionGeneratorContainerGroup<ActorFunction>
    ): GroupHitList {
        const output: GroupHitList = {};

        for (const i in group) {
            if ({}.hasOwnProperty.call(group, i)) {
                output[i] = Object.keys(group[i]);
            }
        }

        return output;
    }
}
