import { IHitCallback, IHitCheck, IThingFunctionGeneratorContainerGroup } from "thinghittr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";
import { Section } from "./Section";

/**
 * Checkers and callbacks for Thing collisions.
 */
export class Collisions<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Names of groups that should be checked for collisions.
     */
    public readonly collidingGroupNames: string[] = [];

    /**
     * Function generator for checking whether a Thing may collide.
     */
    public readonly generateCanThingCollide = () => (thing: IThing) =>
        !thing.removed && !thing.hidden;

    /**
     * Function generators for checking whether two Things are colliding.
     */
    public readonly hitCheckGenerators?: IThingFunctionGeneratorContainerGroup<IHitCheck>;

    /**
     * Function generators for reacting to two Things colliding.
     */
    public readonly hitCallbackGenerators?: IThingFunctionGeneratorContainerGroup<IHitCallback>;
}
