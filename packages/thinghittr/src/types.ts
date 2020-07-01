import { IQuadrant, IThing as IQuadsKeeprIThing } from "quadskeepr";

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
export type IGlobalCheck = (thing: IThing) => boolean;

/**
 * Checks all possible hits for a single Thing, calling the respective hit
 * Function when any are found.
 *
 * @param thing   A Thing whose hits are to be checked.
 */
export type IHitsCheck = (thing: IThing) => void;

/**
 * Determines whether a Thing collides with another Thing.
 *
 * @param thing   A Thing to check collision with.
 * @param other   A Thing to check collision with.
 * @returns Whether the two Things have collided.
 */
export type IHitCheck = (thing: IThing, other: IThing) => boolean;

/**
 * Callback for when a Thing collides with another Thing.
 *
 * @param thing   A Thing that has collided with another Thing.
 * @param other   A Thing that has collided with another Thing.
 */
export type IHitCallback = (thing: IThing, other: IThing) => void;

/**
 * A generic Thing Function.
 */
export type IThingFunction = IGlobalCheck | IHitsCheck | IHitCheck | IHitCallback;

/**
 * Generators for Thing Functions.
 */
export type IThingFunctionGenerator<T extends IThingFunction> = () => T;

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
 * Settings to initialize a new ThingHittr.
 */
export interface IThingHittrSettings {
    /**
     * Function generator for globalChecks.
     */
    globalCheckGenerator?: IThingFunctionGenerator<IGlobalCheck>;

    /**
     * Function generators for hitChecks.
     */
    hitCheckGenerators?: IThingFunctionGeneratorContainerGroup<IHitCheck>;

    /**
     * Function generators for hitCallbacks.
     */
    hitCallbackGenerators?: IThingFunctionGeneratorContainerGroup<IHitCallback>;
}
