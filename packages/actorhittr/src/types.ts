import { Actor as IQuadsKeeprActor,Quadrant } from "quadskeepr";

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
export type GroupHitList = Record<string, string[]>;

/**
 * Determines whether an Actor may all have hits checked.
 *
 * @returns Whether the Actor may all have hits checked.
 */
export type GlobalCheck = (actor: Actor) => boolean;

/**
 * Checks all possible hits for a single Actor, calling the respective hit
 * Function when any are found.
 *
 * @param actor   An Actor whose hits are to be checked.
 */
export type HitsCheck = (actor: Actor) => void;

/**
 * Determines whether an Actor collides with another Actor.
 *
 * @param actor   An Actor to check collision with.
 * @param other   An Actor to check collision with.
 * @returns Whether the two Actors have collided.
 */
export type HitCheck = (actor: Actor, other: Actor) => boolean;

/**
 * Callback for when an Actor collides with another Actor.
 *
 * @param actor   An Actor that has collided with another Actor.
 * @param other   An Actor that has collided with another Actor.
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
export type ActorFunctionGeneratorContainer<T extends ActorFunction> = Record<string, ActorFunctionGenerator<T>>;

/**
 * A group of containers of generators for Actor Functions.
 */
export type ActorFunctionGeneratorContainerGroup<T extends ActorFunction> = Record<string, ActorFunctionGeneratorContainer<T>>;

/**
 * A container of Actor Function generators.
 */
export type ActorFunctionContainer<T extends ActorFunction> = Record<string, T>;

/**
 * A group of containers of functions for Actors.
 */
export type ActorFunctionContainerGroup<T extends ActorFunction> = Record<string, ActorFunctionContainer<T>>;

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
