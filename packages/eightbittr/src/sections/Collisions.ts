import { ActorFunctionGeneratorContainerGroup, HitCallback, HitCheck } from "actorhittr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";
import { Section } from "./Section";

/**
 * Checkers and callbacks for Actor collisions.
 */
export class Collisions<Game extends EightBittr> extends Section<Game> {
    /**
     * Names of groups that should be checked for collisions.
     */
    public readonly collidingGroupNames: string[] = [];

    /**
     * Function generator for checking whether an Actor may collide.
     */
    public readonly generateCanActorCollide = () => (actor: Actor) => !actor.removed;

    /**
     * Function generators for checking whether two Actors are colliding.
     */
    public readonly hitCheckGenerators?: ActorFunctionGeneratorContainerGroup<HitCheck>;

    /**
     * Function generators for reacting to two Actors colliding.
     */
    public readonly hitCallbackGenerators?: ActorFunctionGeneratorContainerGroup<HitCallback>;
}
