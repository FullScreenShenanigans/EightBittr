import { Quadrant, Actor as IQuadsKeeprActor } from "quadskeepr";

/**
 * Any bounding box that can be within quadrant(s).
 */
export interface Actor extends IQuadsKeeprActor {
    /**
     * Which group of Actors this belongs to.
     */
    groupType: string;

    /**
     * Quadrants this may be a member of.
     */
    quadrants: Quadrant<Actor>[];

    /**
     * What type this is within its group.
     */
    title: string;
}

/**
 * For group names, the names of other groups they are allowed to hit.
 */
export interface GroupHitList {
    [i: string]: string[];
}

/**
 * Determines whether a Actor may all have hits checked.
 *
 * @returns Whether the Actor may all have hits checked.
 */
export type GlobalCheck = (actor: Actor) => boolean;

/**
 * Checks all possible hits for a single Actor, calling the respective hit
 * Function when any are found.
 *
 * @param actor   A Actor whose hits are to be checked.
 */
export type HitsCheck = (actor: Actor) => void;

/**
 * Determines whether a Actor collides with another Actor.
 *
 * @param actor   A Actor to check collision with.
 * @param other   A Actor to check collision with.
 * @returns Whether the two Actors have collided.
 */
export type HitCheck = (actor: Actor, other: Actor) => boolean;

/**
 * Callback for when a Actor collides with another Actor.
 *
 * @param actor   A Actor that has collided with another Actor.
 * @param other   A Actor that has collided with another Actor.
 */
export type HitCallback = (actor: Actor, other: Actor) => void;

/**
 * A generic Actor Function.
 */
export type ActorFunction = GlobalCheck | HitsCheck | HitCheck | HitCallback;

/**
 * Generators for Actor Functions.
 */
export type ActorFunctionGenerator<T extends ActorFunction> = () => T;

/**
 * A container of generators for Actor Functions.
 */
export interface ActorFunctionGeneratorContainer<T extends ActorFunction> {
    [i: string]: ActorFunctionGenerator<T>;
}

/**
 * A group of containers of generators for Actor Functions.
 */
export interface ActorFunctionGeneratorContainerGroup<T extends ActorFunction> {
    [i: string]: ActorFunctionGeneratorContainer<T>;
}

/**
 * A container of Actor Function generators.
 */
export interface ActorFunctionContainer<T extends ActorFunction> {
    [i: string]: T;
}

/**
 * A group of containers of functions for Actors.
 */
export interface ActorFunctionContainerGroup<T extends ActorFunction> {
    [i: string]: ActorFunctionContainer<T>;
}

/**
 * Settings to initialize a new ActorHittr.
 */
export interface ActorHittrSettings {
    /**
     * Function generator for globalChecks.
     */
    globalCheckGenerator?: ActorFunctionGenerator<GlobalCheck>;

    /**
     * Function generators for hitChecks.
     */
    hitCheckGenerators?: ActorFunctionGeneratorContainerGroup<HitCheck>;

    /**
     * Function generators for hitCallbacks.
     */
    hitCallbackGenerators?: ActorFunctionGeneratorContainerGroup<HitCallback>;
}
