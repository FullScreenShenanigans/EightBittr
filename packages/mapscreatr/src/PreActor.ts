import { ObjectMakr } from "objectmakr";

import { PreActorLike, PreActorSettings } from "./PreActorLike";
import { Actor } from "./Actor";

/**
 * Basic storage container for a single Actor to be stored in an Area.
 */
export class PreActor implements PreActorLike {
    /**
     * The contained Actor to be placed during gameplay.
     */
    public readonly actor: Actor;

    /**
     * A copy of the Actor's title.
     */
    public readonly title: string;

    /**
     * The creation command used to create the Actor.
     */
    public readonly reference: any;

    /**
     * Whether this PreActor has already spawned (initially false).
     */
    public readonly spawned: boolean;

    /**
     * The top edge of the Actor's bounding box.
     */
    public readonly top: number;

    /**
     * The right edge of the Actor's bounding box.
     */
    public readonly right: number;

    /**
     * The bottom edge of the Actor's bounding box.
     */
    public readonly bottom: number;

    /**
     * The left edge of the Actor's bounding box.
     */
    public readonly left: number;

    /**
     * An optional modifier instruction for group placement, from reference.
     */
    public readonly position: string;

    /**
     * Initializes a new PreActor.
     *
     * @param actor   The Actor, freshly created by ObjectMaker.make.
     * @param reference   The creation Object instruction used to create the Actor.
     */
    public constructor(actor: Actor, reference: PreActorSettings, objectMaker: ObjectMakr) {
        this.actor = actor;
        this.title = actor.title;
        this.reference = reference;
        this.spawned = false;

        this.left = reference.x || 0;
        this.top = reference.y || 0;

        this.right =
            this.left +
            (reference.width || objectMaker.getPrototypeOf<PreActorSettings>(this.title).width!);
        this.bottom =
            this.top +
            (reference.height ||
                objectMaker.getPrototypeOf<PreActorSettings>(this.title).height!);

        if (reference.position) {
            this.position = reference.position;
        }
    }
}
