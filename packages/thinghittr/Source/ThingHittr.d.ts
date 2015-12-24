declare module ThingHittr {
    /**
     * For group names, the names of other groups they are allowed to hit.
     */
    export interface IGroupHitList {
        [i: string]: string[];
    }

    /**
     * Determines whether a Thing may all have hits checked.
     * 
     * @returns Whether the Thing may all have hits checked.
     */
    export interface IGlobalCheck {
        (thing: QuadsKeepr.IThing): boolean;
    }

    /**
     * Checks all possible hits for a single Thing, calling the respective hit 
     * Function when any are found.
     * 
     * @param thing   A Thing whose hits are to be checked.
     */
    export interface IHitsCheck {
        (thing: QuadsKeepr.IThing): void;
    }

    /** 
     * Determines whether a Thing collides with another Thing.
     *
     * @param thing   A Thing to check collision with.
     * @param other   A Thing to check collision with.
     * @returns Whether the two Things have collided.
     */
    export interface IHitCheck {
        (thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): boolean;
    }

    /**
     * Callback for when a Thing collides with another Thing.
     * 
     * @param thing   A Thing that has collided with another Thing.
     * @param other   A Thing that has collided with another Thing.
     * 
     */
    export interface IHitCallback {
        (thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): void;
    }

    /**
     * A generic Thing Function.
     */
    export type IThingFunction = IGlobalCheck | IHitsCheck | IHitCheck | IHitCallback;

    export interface IThingFunctionGenerator<T extends IThingFunction> {
        (): T;
    }

    export interface IThingFunctionGeneratorContainer<T extends IThingFunction> {
        [i: string]: IThingFunctionGenerator<T>;
    }

    export interface IThingFunctionGeneratorContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionGeneratorContainer<T>;
    }

    export interface IThingFunctionContainer<T extends IThingFunction> {
        [i: string]: T;
    }

    export interface IThingFunctionContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionContainer<T>;
    }

    /**
     * Settings to initialize a new IThingHittr.
     */
    export interface IThingHittrSettings {
        /**
         * The key under which Things store their number of quadrants (by default, "numquads").
         */
        keyNumQuads?: string;

        /**
         * The key under which Things store their quadrants (by default, "quadrants").
         */
        keyQuadrants?: string;

        /**
         * The key under which Things store which group they fall under (by default, "group").
         */
        keyGroupName?: string;

        /**
         * The key under which Things store which type they fall under (by default, "type").
         */
        keyTypeName?: string;

        /**
         * The Function generators used globalChecks.
         */
        globalCheckGenerators: IThingFunctionGeneratorContainer<IGlobalCheck>;

        /**
         * The Function generators used for hitChecks.
         */
        hitCheckGenerators: IThingFunctionGeneratorContainerGroup<IHitCheck>;

        /**
         * The Function generators used for hitCallbacks.
         */
        hitCallbackGenerators: IThingFunctionGeneratorContainerGroup<IHitCallback>;
    }
    
    /**
     * A Thing collision detection automator that unifies GroupHoldr and QuadsKeepr.
     * Functions for checking whether a Thing may collide, checking whether it collides
     * with another Thing, and reacting to a collision are generated and cached for
     * each Thing type, based on the overarching Thing groups.
     */
    export interface IThingHittr {
        /**
         * Caches global and hits checks for the given type if they do not yet exist.
         * 
         * @param typeName   The type to cache hits for.
         * @param groupName   The general group the type fall sunder.
         */
        cacheChecksForType(typeName: string, groupName: string): void;

        /**
         * Checks all hits for a Thing using its generated hits check.
         * 
         * @param thing   The Thing to have hits checked.
         */
        checkHitsForThing(thing: QuadsKeepr.IThing): void;

        /**
         * Checks whether two Things are hitting.
         * 
         * @param thing   The primary Thing that may be hitting other.
         * @param other   The secondary Thing that may be being hit by thing.
         * @returns Whether the two Things are hitting.
         */
        checkHitForThings(thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): boolean;

        /**
         * Reacts to two Things hitting.
         * 
         * @param thing   The primary Thing that is hitting other.
         * @param other   The secondary Thing that is being hit by thing.
         */
        runHitCallbackForThings(thing: QuadsKeepr.IThing, other: QuadsKeepr.IThing): void;
    }
}
