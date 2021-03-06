import {
    IGlobalCheck,
    IGroupHitList,
    IHitCallback,
    IHitCheck,
    IHitsCheck,
    IThing,
    IThingFunction,
    IThingFunctionContainer,
    IThingFunctionContainerGroup,
    IThingFunctionGenerator,
    IThingFunctionGeneratorContainerGroup,
    IThingHittrSettings,
} from "./types";

/**
 * Automation for physics collisions and reactions.
 */
export class ThingHittr {
    /**
     * For each group name, the names of other groups it is allowed to hit.
     */
    private readonly groupHitLists: IGroupHitList;

    /**
     * Function generator for globalChecks.
     */
    private readonly globalCheckGenerator?: IThingFunctionGenerator<IGlobalCheck>;

    /**
     * Function generators for hitChecks.
     */
    private readonly hitCheckGenerators: IThingFunctionGeneratorContainerGroup<IHitCheck>;

    /**
     * Function generators for HitCallbacks.
     */
    private readonly hitCallbackGenerators: IThingFunctionGeneratorContainerGroup<IHitCallback>;

    /**
     * Check Functions for Things within groups to see if they're able to
     * collide in the first place.
     */
    private readonly generatedGlobalChecks: IThingFunctionContainer<IGlobalCheck>;

    /**
     * Collision detection Functions to check two Things for collision.
     */
    private readonly generatedHitChecks: IThingFunctionContainerGroup<IHitCheck>;

    /**
     * Hit Function callbacks for when two Things do collide.
     */
    private readonly generatedHitCallbacks: IThingFunctionContainerGroup<IHitCallback>;

    /**
     * Hits checkers for when a Thing should have its hits detected.
     */
    private readonly generatedHitsChecks: IThingFunctionContainer<IHitsCheck>;

    /**
     * Initializes a new instance of the ThingHittr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IThingHittrSettings = {}) {
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
     * @param groupName   What classification of Thing to cache hits for.
     * @param typeName   The specific Thing title to cache hits for.
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
     * Checks all hits for a Thing using its generated hits check.
     *
     * @param thing   The Thing to have hits checked.
     */
    public checkHitsForThing(thing: IThing): void {
        this.generatedHitsChecks[thing.title](thing);
    }

    /**
     * Checks whether two Things are hitting.
     *
     * @param thing   The primary Thing that may be hitting other.
     * @param other   The secondary Thing that may be being hit by thing.
     * @returns Whether the two Things are hitting.
     */
    public checkHitForThings(thing: IThing, other: IThing): boolean {
        return !!this.runThingsFunctionSafely(
            this.generatedHitChecks,
            thing,
            other,
            this.hitCheckGenerators
        );
    }

    /**
     * Reacts to two Things hitting.
     *
     * @param thing   The primary Thing that is hitting other.
     * @param other   The secondary Thing that is being hit by thing.
     */
    public runHitCallbackForThings(thing: IThing, other: IThing): void {
        this.runThingsFunctionSafely(
            this.generatedHitCallbacks,
            thing,
            other,
            this.hitCallbackGenerators
        );
    }

    /**
     * Function generator for a hits check for a specific Thing type.
     *
     * @param groupName   The type of the Things to generate for.
     * @returns A Function that can check all hits for a Thing of the given type.
     */
    private generateHitsCheck(groupName: string): IHitsCheck {
        /**
         * Collision detection Function for a Thing. For each Quadrant the Thing
         * is in, for all groups within that Function that the Thing's group is
         * allowed to collide with, it is checked for collision with the Things
         * in that group. For each Thing it does collide with, the appropriate
         * hit Function is called.
         *
         * @param thing   A Thing to check collision detection for.
         */
        return (thing: IThing): void => {
            // Don't do anything if the thing shouldn't be checking
            if (
                {}.hasOwnProperty.call(this.generatedGlobalChecks, groupName) &&
                !this.generatedGlobalChecks[groupName](thing)
            ) {
                return;
            }

            // For each quadrant the Thing is in...
            for (let i = 0; i < thing.numQuadrants; i += 1) {
                // For each group within that quadrant the Thing may collide with...
                for (const groupName of this.groupHitLists[thing.groupType]) {
                    // For each other Thing in the group that should be checked...
                    for (let j = 0; j < thing.quadrants[i].numthings[groupName]; j += 1) {
                        const other = thing.quadrants[i].things[groupName][j];
                        // If they are the same, breaking to prevent double hits
                        if (thing === other) {
                            break;
                        }

                        // Do nothing if other can't collide in the first place
                        if (!this.generatedGlobalChecks[other.title](other)) {
                            continue;
                        }

                        // If they do hit, call the corresponding hitCallback
                        if (this.checkHitForThings(thing, other)) {
                            this.runHitCallbackForThings(thing, other);
                        }
                    }
                }
            }
        };
    }

    /**
     * Runs the Function in the group that maps to the two Things' types. If it doesn't
     * yet exist, it is created.
     *
     * @param group   The group of Functions to use.
     * @param thing   The primary Thing reacting to other.
     * @param other   The secondary Thing that thing is reacting to.
     * @returns The result of the ThingFunction from the group.
     */
    private runThingsFunctionSafely(
        group: IThingFunctionContainerGroup<IThingFunction>,
        thing: IThing,
        other: IThing,
        generators: IThingFunctionGeneratorContainerGroup<IThingFunction>
    ): boolean | void {
        const typeThing = thing.title;
        const typeOther = other.title;
        let container = group[typeThing];
        if (container === undefined) {
            container = group[typeThing] = {};
        }

        let check = container[typeOther];
        if (check === undefined) {
            check = container[typeOther] = generators[thing.groupType][other.groupType]();
        }

        return (check as IHitCheck)(thing, other);
    }

    /**
     * Generates the list of group names each group is allowed to hit.
     *
     * @param group   A summary of group containers.
     */
    private generateGroupHitLists(
        group: IThingFunctionGeneratorContainerGroup<IThingFunction>
    ): IGroupHitList {
        const output: IGroupHitList = {};

        for (const i in group) {
            if ({}.hasOwnProperty.call(group, i)) {
                output[i] = Object.keys(group[i]);
            }
        }

        return output;
    }
}
