import { IPixelRendr } from "pixelrendr";

/**
 * Create a canvas of a given width and height.
 *
 * @param width   Width of the canvas.
 * @param height   Height of the canvas.
 * @returns Canvas of the given width and height.
 */
export type ICreateCanvas = (width: number, height: number) => HTMLCanvasElement;

/**
 * Generates a retrieval key for a Thing.
 *
 * @param thing   Thing to create a key from.
 * @returns Retrieval key for the Thing.
 */
export type IGenerateObjectKey = (thing: IThing) => string;

/**
 * Boundaries of a drawing area, commonly fulfilled by an IMapScreenr.
 */
export interface IBoundingBox {
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
export interface IThing extends IBoundingBox {
    /**
     * Whether this shouldn't be drawn (is completely hidden).
     */
    hidden: boolean;

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
     * Whether the Thing's sprite should repeat across large canvases.
     */
    repeat?: boolean;

    /**
     * How much to expand the Thing's sprite size (by default, 1 for not at all).
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
export interface IPixelDrawrSettings {
    /**
     * The PixelRendr used for sprite lookups and generation.
     */
    pixelRender: IPixelRendr;

    /**
     * The bounds of the screen for bounds checking (typically an IMapScreenr).
     */
    boundingBox: IBoundingBox;

    /**
     * Canvas element each Thing is to be drawn on.
     */
    canvas: HTMLCanvasElement;

    /**
     * Creates a canvas of a given width and height.
     */
    createCanvas: ICreateCanvas;

    /**
     * Arrays of Thing[]s that are to be drawn in each refill.
     */
    thingArrays?: IThing[][];

    /**
     * Whether refills should skip redrawing the background each time.
     */
    noRefill?: boolean;

    /**
     * The maximum size of a SpriteMultiple to pre-render (by default, 0 for
     * never pre-rendering).
     */
    spriteCacheCutoff?: number;

    /**
     * How often to draw frames (by default, 1 for every time).
     */
    framerateSkip?: number;

    /**
     * Generates retrieval keys for Things (by default, toString).
     */
    generateObjectKey?: IGenerateObjectKey;

    /**
     * An arbitrarily small minimum opacity for a Thing to be considered not
     * completely transparent (by default, .007).
     */
    epsilon?: number;
}

/**
 * A real-time scene drawer for large amounts of PixelRendr sprites.
 */
export interface IPixelDrawr {
    /**
     * @returns How often refill calls should be skipped.
     */
    getFramerateSkip(): number;

    /**
     * @returns The Arrays to be redrawn during refill calls.
     */
    getThingArrays(): IThing[][];

    /**
     * @returns The canvas element each Thing is to drawn on.
     */
    getCanvas(): HTMLCanvasElement;

    /**
     * @returns The 2D canvas context associated with the canvas.
     */
    getContext(): CanvasRenderingContext2D;

    /**
     * @returns The canvas element used for the background.
     */
    getBackgroundCanvas(): HTMLCanvasElement;

    /**
     * @returns The 2D canvas context associated with the background canvas.
     */
    getBackgroundContext(): CanvasRenderingContext2D;

    /**
     * @returns Whether refills should skip redrawing the background each time.
     */
    getNoRefill(): boolean;

    /**
     * @returns The minimum opacity that will be drawn.
     */
    getEpsilon(): number;

    /**
     * @param framerateSkip   How often refill calls should be skipped.
     */
    setFramerateSkip(framerateSkip: number): void;

    /**
     * @param thingArrays   The Arrays to be redrawn during refill calls.
     */
    setThingArrays(thingArrays: IThing[][]): void;

    /**
     * @param noRefill   Whether refills should now skip redrawing the
     *                   background each time.
     */
    setNoRefill(noRefill: boolean): void;

    /**
     * @param epsilon   The minimum opacity that will be drawn.
     */
    setEpsilon(epsilon: number): void;

    /**
     * Creates a new canvas the size of MapScreener and sets the background
     * canvas to it, then recreates backgroundContext.
     */
    resetBackground(): void;

    /**
     * Refills the background canvas with a new fillStyle.
     *
     * @param fillStyle   The new fillStyle for the background context.
     */
    setBackground(fillStyle: any): void;

    /**
     * Draws the background canvas onto the main canvas' context.
     */
    drawBackground(): void;

    /**
     * Called every upkeep to refill the entire main canvas. All Thing arrays
     * are made to call this.refillThingArray in order.
     */
    refillGlobalCanvas(): void;

    /**
     * Calls drawThingOnContext on each Thing in the Array.
     *
     * @param array   A listing of Things to be drawn onto the canvas.
     */
    refillThingArray(array: IThing[]): void;

    /**
     * General Function to draw a Thing onto a context. This will call
     * drawThingOnContext[Single/Multiple] with more arguments.
     *
     * @param context   The context to have the Thing drawn on it.
     * @param thing   The Thing to be drawn onto the context.
     */
    drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void;
}
