import { Actor } from "./Actor";

/**
 * Settings to initialize a new PreActor.
 */
export interface PreActorSettings {
    /**
     * The horizontal starting location of the Actor (by default, 0).
     */
    x?: number;

    /**
     * The vertical starting location of the Actor (by default, 0).
     */
    y?: number;

    /**
     * How wide the Actor is (by default, the Actor's prototype's width from
     * ObjectMaker.getFullPropertiesOf).
     */
    width?: number;

    /**
     * How tall the Actor is (by default, the Actor's prototype's height from
     * ObjectMaker.getFullPropertiesOf).
     */
    height?: number;

    /**
     * An optional immediate modifier instruction for where the Actor should be
     * in its GroupHoldr group (either "beginning", "end", or undefined).
     */
    position?: string;

    /**
     * PreActors may pass any settings onto their created Actors.
     */
    [i: string]: any;
}

/**
 * A position holder around an in-game Actor.
 */
export interface PreActorLike {
    /**
     * The in-game Actor.
     */
    actor: Actor;

    /**
     * What type the Actor is.
     */
    title: any;

    /**
     * The raw JSON-friendly settings that created this.
     */
    reference: PreActorSettings;

    /**
     * Whether the Actor has been placed in the container Map.
     */
    spawned: boolean;

    /**
     * The top edge of the Actor's bounding box.
     */
    top: number;

    /**
     * The right edge of the Actor's bounding box.
     */
    right: number;

    /**
     * The bottom edge of the Actor's bounding box.
     */
    bottom: number;

    /**
     * The left edge of the Actor's bounding box.
     */
    left: number;

    /**
     * What part of the in-game container group to move this to, if needed.
     */
    position?: string;
}
