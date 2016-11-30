import { IQuadrant, IThing as IQuadsKeeprIThing } from "quadskeepr/lib/IQuadsKeepr";

/**
 * Any bounding box that can be within quadrant(s).
 */
export interface IThing extends IQuadsKeeprIThing {
    /**
     * Which group of Things this belongs to.
     */
    groupType: string;

    /**
     * Quadrants this may be a member of.
     */
    quadrants: IQuadrant<IThing>[];

    /**
     * What type this is within its group.
     */
    title: string;
}

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
    (thing: IThing): boolean;
}

/**
 * Checks all possible hits for a single Thing, calling the respective hit 
 * Function when any are found.
 * 
 * @param thing   A Thing whose hits are to be checked.
 */
export interface IHitsCheck {
    (thing: IThing): void;
}

/** 
 * Determines whether a Thing collides with another Thing.
 *
 * @param thing   A Thing to check collision with.
 * @param other   A Thing to check collision with.
 * @returns Whether the two Things have collided.
 */
export interface IHitCheck {
    (thing: IThing, other: IThing): boolean;
}

/**
 * Callback for when a Thing collides with another Thing.
 * 
 * @param thing   A Thing that has collided with another Thing.
 * @param other   A Thing that has collided with another Thing.
 * 
 */
export interface IHitCallback {
    (thing: IThing, other: IThing): void;
}

/**
 * A generic Thing Function.
 */
export type IThingFunction = IGlobalCheck | IHitsCheck | IHitCheck | IHitCallback;

/**
 * Generators for Thing Functions.
 */
export interface IThingFunctionGenerator<T extends IThingFunction> {
    (): T;
}

/**
 * A container of generators for Thing Functions.
 */
export interface IThingFunctionGeneratorContainer<T extends IThingFunction> {
    [i: string]: IThingFunctionGenerator<T>;
}

/**
 * A group of containers of generators for Thing Functions.
 */
export interface IThingFunctionGeneratorContainerGroup<T extends IThingFunction> {
    [i: string]: IThingFunctionGeneratorContainer<T>;
}

/**
 * A container of Thing Function generators.
 */
export interface IThingFunctionContainer<T extends IThingFunction> {
    [i: string]: T;
}

/**
 * A group of containers of functions for Things.
 */
export interface IThingFunctionContainerGroup<T extends IThingFunction> {
    [i: string]: IThingFunctionContainer<T>;
}

/**
 * Settings to initialize a new IThingHittr.
 */
export interface IThingHittrSettings {
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

    /**
     * A scope to run generators in, if not this.
     */
    generatorScope?: any;
}

/**
 * A Thing collision detection automator that unifies GroupHoldr and 
 * Functions for checking whether a Thing may collide, checking whether it collides
 * with another Thing, and reacting to a collision are generated and cached for
 * each Thing type, based on the overarching Thing groups.
 */
export interface IThingHittr {
    /**
     * Sets the scope to run generators in, if not this.
     * 
     * @param generatorScope   A scope to run generators in, if not this.
     */
    setGeneratorScope(generatorScope: any): void;

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
    checkHitsForThing(thing: IThing): void;

    /**
     * Checks whether two Things are hitting.
     * 
     * @param thing   The primary Thing that may be hitting other.
     * @param other   The secondary Thing that may be being hit by thing.
     * @returns Whether the two Things are hitting.
     */
    checkHitForThings(thing: IThing, other: IThing): boolean;

    /**
     * Reacts to two Things hitting.
     * 
     * @param thing   The primary Thing that is hitting other.
     * @param other   The secondary Thing that is being hit by thing.
     */
    runHitCallbackForThings(thing: IThing, other: IThing): void;
}
