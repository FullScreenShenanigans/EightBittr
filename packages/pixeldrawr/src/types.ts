import { PixelRendr } from "pixelrendr";

/**
 * Generates a retrieval key for an Actor.
 *
 * @param actor   Actor to create a key from.
 * @returns Retrieval key for the Actor.
 */
export type GenerateObjectKey = (actor: Actor) => string;

/**
 * Background and foreground contexts to draw onto.
 */
export interface DrawingContexts {
    /**
     *
     */
    background: CanvasRenderingContext2D;

    /**
     *
     */
    foreground: CanvasRenderingContext2D;
}

/**
 * Boundaries of a drawing area, commonly fulfilled by an MapScreenr.
 */
export interface BoundingBox {
    /**
     * The top boundary of the screen.
     */
    top: number;

    /**
     * The right boundary of the screen.
     */
    right: number;

    /**
     * The bottom boundary of the screen.
     */
    bottom: number;

    /**
     * The left boundary of the screen.
     */
    left: number;

    /**
     * The width of the screen.
     */
    width: number;

    /**
     * The height of the screen.
     */
    height: number;
}

/**
 * Collected information about a sprite that must be drawn.
 */
export interface Actor extends BoundingBox {
    /**
     * Whether this shouldn't be drawn (is completely hidden).
     */
    hidden?: boolean;

    /**
     * How transparent this is, in [0, 1].
     */
    opacity: number;

    /**
     * Horizontal visual offset.
     */
    offsetX?: number;

    /**
     * Vertical visual offset.
     */
    offsetY?: number;

    /**
     * Whether the Actor's sprite should repeat across large canvases.
     */
    repeat?: boolean;

    /**
     * Radian degrees to rotate by, if rotated at all.
     */
    rotation?: number;

    /**
     * How much to expand the Actor's sprite size (by default, 1 for not at all).
     */
    scale?: number;

    /**
     * How many pixels wide the output sprite should be.
     */
    spritewidth: number;

    /**
     * How many pixels high the output sprite should be.
     */
    spriteheight: number;
}

/**
 * Settings to initialize a new IPixelDrawr.
 */
export interface PixelDrawrSettings {
    /**
     * Initial background to set, if any.
     */
    background?: string;

    /**
     * The bounds of the screen for bounds checking (typically a MapScreenr).
     */
    boundingBox: BoundingBox;

    /**
     * Background and foreground contexts to draw onto.
     */
    contexts: DrawingContexts;

    /**
     * Arrays of Actor[]s that are to be drawn in each refill.
     */
    actorArrays?: Actor[][];

    /**
     * An arbitrarily small minimum opacity for an Actor to be considered not
     * completely transparent (by default, .007).
     */
    epsilon?: number;

    /**
     * How often to draw frames (by default, 1 for every time).
     */
    framerateSkip?: number;

    /**
     * Generates retrieval keys for Actors (by default, toString).
     */
    generateObjectKey: GenerateObjectKey;

    /**
     * The PixelRendr used for sprite lookups and generation.
     */
    pixelRender: PixelRendr;

    /**
     * The maximum size of a SpriteMultiple to pre-render (by default, 0 for
     * never pre-rendering).
     */
    spriteCacheCutoff?: number;
}
