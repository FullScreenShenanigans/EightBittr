import {
    IGlobalCheck, IGroupHitList, IHitCallback, IHitCheck, IHitsCheck,
    IThing, IThingFunction, IThingFunctionContainer, IThingFunctionContainerGroup,
    IThingFunctionGeneratorContainer, IThingFunctionGeneratorContainerGroup,
    IThingHittr, IThingHittrSettings
} from "./IThingHittr";

/**
 * Automation for physics collisions and reactions.
 */
export class ThingHittr implements IThingHittr {
    /**
     * For each group name, the names of other groups it is allowed to hit.
     */
    private groupHitLists: IGroupHitList;

    /**
     * Function generators for globalChecks.
     */
    private globalCheckGenerators: IThingFunctionGeneratorContainer<IGlobalCheck>;

    /**
     * Function generators for hitChecks.
     */
    private hitCheckGenerators: IThingFunctionGeneratorContainerGroup<IHitCheck>;

    /**
     * Function generators for HitCallbacks.
     */
    private hitCallbackGenerators: IThingFunctionGeneratorContainerGroup<IHitCallback>;

    /**
     * Check Functions for Things within groups to see if they're able to
     * collide in the first place.
     */
    private generatedGlobalChecks: IThingFunctionContainer<IGlobalCheck>;

    /**
     * Collision detection Functions to check two Things for collision.
     */
    private generatedHitChecks: IThingFunctionContainerGroup<IHitCheck>;

    /**
     * Hit Function callbacks for when two Things do collide.
     */
    private generatedHitCallbacks: IThingFunctionContainerGroup<IHitCallback>;

    /**
     * Hits checkers for when a Thing should have its hits detected.
     */
    private generatedHitsChecks: IThingFunctionContainer<IHitsCheck>;

    /**
     * A scope to run generators in, if not this.
     */
    private generatorScope: any;

    /**
     * Initializes a new instance of the ThingHittr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    constructor(settings: IThingHittrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to ThingHittr.");
        }
        if (typeof settings.globalCheckGenerators === "undefined") {
            throw new Error("No globalCheckGenerators given to ThingHittr.");
        }
        if (typeof settings.hitCheckGenerators === "undefined") {
            throw new Error("No hitCheckGenerators given to ThingHittr.");
        }
        if (typeof settings.hitCallbackGenerators === "undefined") {
            throw new Error("No hitCallbackGenerators given to ThingHittr.");
        }

        this.globalCheckGenerators = settings.globalCheckGenerators;
        this.hitCheckGenerators = settings.hitCheckGenerators;
        this.hitCallbackGenerators = settings.hitCallbackGenerators;
        this.generatorScope = settings.generatorScope;

        this.generatedHitChecks = {};
        this.generatedHitCallbacks = {};
        this.generatedGlobalChecks = {};
        this.generatedHitsChecks = {};

        this.groupHitLists = this.generateGroupHitLists(this.hitCheckGenerators);
    }

    /**
     * Sets the scope to run generators in, if not this.
     * 
     * @param generatorScope   A scope to run generators in, if not this.
     */
    public setGeneratorScope(generatorScope: any): void {
        this.generatorScope = generatorScope;
    }

    /**
     * Caches global and hits checks for the given type if they do not yet exist
     * and have their generators defined
     * 
     * @param typeName   The type to cache hits for.
     * @param groupName   The general group the type fall sunder.
     */
    public cacheChecksForType(typeName: string, groupName: string): void {
        if (!this.generatedGlobalChecks.hasOwnProperty(typeName) && this.globalCheckGenerators.hasOwnProperty(groupName)) {
            this.generatedGlobalChecks[typeName] = this.globalCheckGenerators[groupName].call(this.generatorScope);
            this.generatedHitsChecks[typeName] = this.generateHitsCheck(typeName);
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
        return this.runThingsFunctionSafely(this.generatedHitChecks, thing, other, this.hitCheckGenerators);
    }

    /**
     * Reacts to two Things hitting.
     * 
     * @param thing   The primary Thing that is hitting other.
     * @param other   The secondary Thing that is being hit by thing.
     */
    public runHitCallbackForThings(thing: IThing, other: IThing): void {
        this.runThingsFunctionSafely(this.generatedHitCallbacks, thing, other, this.hitCallbackGenerators);
    }

    /**
     * Function generator for a hits check for a specific Thing type.
     * 
     * @param typeName   The type of the Things to generate for.
     * @returns A Function that can check all hits for a Thing of the given type.
     */
    private generateHitsCheck(typeName: string): IHitsCheck {
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
            if (!this.generatedGlobalChecks[typeName](thing)) {
                return;
            }

            const groupNames: string[] = this.groupHitLists[thing.groupType];

            // For each quadrant thing is in, look at each of its groups that thing can check
            for (let i: number = 0; i < thing.numQuadrants; i += 1) {
                for (let j: number = 0; j < groupNames.length; j += 1) {
                    const groupName: string = groupNames[j];
                    const others: IThing[] = thing.quadrants[i].things[groupName];

                    // For each other Thing in this group that should be checked...
                    for (let k: number = 0; k < others.length; k += 1) {
                        const other: IThing = others[k];

                        // If they are the same, breaking prevents double hits
                        if (thing === other) {
                            break;
                        }

                        // Do nothing if other can't collide in the first place
                        if (!this.generatedGlobalChecks[other.title](other)) {
                            continue;
                        }

                        // If they do hit (hitCheck), call the corresponding hitCallback
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
        generators: IThingFunctionGeneratorContainerGroup<IThingFunction>): any {
        const typeThing: string = thing.title;
        const typeOther: string = other.title;
        let container: IThingFunctionContainer<IThingFunction> = group[typeThing];

        if (!container) {
            container = group[typeThing] = {};
        }

        let check: IThingFunction = container[typeOther];
        if (!check) {
            check = container[typeOther] = generators[thing.groupType][other.groupType].call(this.generatorScope);
        }

        return (check as Function)(thing, other);
    }

    /**
     * Generates the list of group names each group is allowd to hit.
     * 
     * @param group   A summary of group containers.
     */
    private generateGroupHitLists(group: IThingFunctionGeneratorContainerGroup<IThingFunction>): IGroupHitList {
        const output: IGroupHitList = {};

        for (const i in group) {
            if (group.hasOwnProperty(i)) {
                output[i] = Object.keys(group[i]);
            }
        }

        return output;
    }
}
