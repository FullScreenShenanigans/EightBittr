import { ICanvases, PixelRendr, SpriteMultiple, SpriteSingle } from "pixelrendr";

import { IBoundingBox, ICreateCanvas, IPixelDrawrSettings, IThing } from "./types";

/**
 * @param thing   Any Thing.
 * @returns The Thing's top position, accounting for vertical offset if needed.
 */
const getTop = (thing: IThing): number => (thing.top + (thing.offsetY || 0)) | 0;

/**
 * @param thing   Any Thing.
 * @returns The Thing's right position, accounting for horizontal offset if needed.
 */
const getRight = (thing: IThing): number => (thing.right + (thing.offsetX || 0)) | 0;

/**
 * @param thing   Any Thing.
 * @returns {Number} The Thing's bottom position, accounting for vertical
 *                  offset if needed.
 */
const getBottom = (thing: IThing): number => (thing.bottom + (thing.offsetY || 0)) | 0;

/**
 * @param thing   Any Thing.
 * @returns The Thing's left position, accounting for horizontal offset if needed.
 */
const getLeft = (thing: IThing): number => (thing.left + (thing.offsetX || 0)) | 0;

const getMidX = (thing: IThing): number => getLeft(thing) + thing.width / 2;

const getMidY = (thing: IThing): number => getTop(thing) + thing.height / 2;

/**
 * Real-time scene drawer for PixelRendr sprites.
 */
export class PixelDrawr {
    /**
     * A PixelRendr used to obtain raw sprite data and canvases.
     */
    private readonly pixelRender: PixelRendr;

    /**
     * The bounds of the screen for bounds checking (often a MapScreenr).
     */
    private readonly boundingBox: IBoundingBox;

    /**
     * Canvas element each Thing is to be drawn on.
     */
    private readonly canvas: HTMLCanvasElement;

    /**
     * The 2D canvas context associated with the canvas.
     */
    private readonly context: CanvasRenderingContext2D;

    /**
     * A separate canvas that keeps the background of the scene.
     */
    private backgroundCanvas: HTMLCanvasElement;

    /**
     * The 2D canvas context associated with the background canvas.
     */
    private backgroundContext: CanvasRenderingContext2D;

    /**
     * Arrays of Thing[]s that are to be drawn in each refill.
     */
    private thingArrays: IThing[][];

    /**
     * Creates a canvas of a given height and width.
     */
    private readonly createCanvas: ICreateCanvas;

    /**
     * Utility Function to generate a class key for a Thing.
     */
    private readonly generateObjectKey: (thing: IThing) => string;

    /**
     * Whether refills should skip redrawing the background each time.
     */
    private noRefill: boolean;

    /**
     * How often the screen redraws (1 for always, 2 for every other call, etc).
     */
    private framerateSkip: number;

    /**
     * How many frames have been drawn so far.
     */
    private framesDrawn: number;

    /**
     * An arbitrarily small minimum for opacity to be completely transparent.
     */
    private epsilon: number;

    /**
     * Initializes a new instance of the PixelDrawr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IPixelDrawrSettings) {
        this.pixelRender = settings.pixelRender;
        this.boundingBox = settings.boundingBox;
        this.createCanvas = settings.createCanvas;
        this.canvas = settings.canvas;

        this.context = this.canvas.getContext("2d")!;
        this.noRefill = !!settings.noRefill;
        this.framerateSkip = settings.framerateSkip || 1;
        this.framesDrawn = 0;
        this.epsilon = settings.epsilon || 0.007;
        this.thingArrays = settings.thingArrays || [];

        this.generateObjectKey =
            settings.generateObjectKey || ((thing: IThing) => thing.toString());

        this.resetBackground();

        if (settings.background) {
            this.setBackground(settings.background);
        }
    }

    /**
     * @returns How often refill calls should be skipped.
     */
    public getFramerateSkip(): number {
        return this.framerateSkip;
    }

    /**
     * @returns The Arrays to be redrawn during refill calls.
     */
    public getThingArrays(): IThing[][] {
        return this.thingArrays;
    }

    /**
     * @returns The canvas element each Thing is to drawn on.
     */
    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    /**
     * @returns The 2D canvas context associated with the canvas.
     */
    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    /**
     * @returns The canvas element used for the background.
     */
    public getBackgroundCanvas(): HTMLCanvasElement {
        return this.backgroundCanvas;
    }

    /**
     * @returns The 2D canvas context associated with the background canvas.
     */
    public getBackgroundContext(): CanvasRenderingContext2D {
        return this.backgroundContext;
    }

    /**
     * @returns Whether refills should skip redrawing the background each time.
     */
    public getNoRefill(): boolean {
        return this.noRefill;
    }

    /**
     * @returns The minimum opacity that will be drawn.
     */
    public getEpsilon(): number {
        return this.epsilon;
    }

    /**
     * @param framerateSkip   How often refill calls should be skipped.
     */
    public setFramerateSkip(framerateSkip: number): void {
        this.framerateSkip = framerateSkip;
    }

    /**
     * @param thingArrays   The Arrays to be redrawn during refill calls.
     */
    public setThingArrays(thingArrays: IThing[][]): void {
        this.thingArrays = thingArrays;
    }

    /**
     * @param noRefill   Whether refills should now skip redrawing the
     *                   background each time.
     */
    public setNoRefill(noRefill: boolean): void {
        this.noRefill = noRefill;
    }

    /**
     * @param epsilon   The minimum opacity that will be drawn.
     */
    public setEpsilon(epsilon: number): void {
        this.epsilon = epsilon;
    }

    /**
     * Creates a new canvas the size of MapScreener and sets the background
     * canvas to it, then recreates backgroundContext.
     */
    public resetBackground(): void {
        this.backgroundCanvas = this.createCanvas(
            this.boundingBox.width,
            this.boundingBox.height
        );
        this.backgroundContext = this.backgroundCanvas.getContext("2d")!;
    }

    /**
     * Refills the background canvas with a new fillStyle.
     *
     * @param fillStyle   The new fillStyle for the background context.
     */
    public setBackground(fillStyle: string): void {
        this.backgroundContext.fillStyle = fillStyle;
        this.backgroundContext.fillRect(0, 0, this.boundingBox.width, this.boundingBox.height);
    }

    /**
     * Draws the background canvas onto the main canvas' context.
     */
    public drawBackground(): void {
        this.context.drawImage(this.backgroundCanvas, 0, 0);
    }

    /**
     * Called every upkeep to refill the entire main canvas. All Thing arrays
     * are made to call this.refillThingArray in order.
     */
    public refillGlobalCanvas(): void {
        this.framesDrawn += 1;
        if (this.framesDrawn % this.framerateSkip !== 0) {
            return;
        }

        if (!this.noRefill) {
            this.drawBackground();
        }

        for (const array of this.thingArrays) {
            this.refillThingArray(array);
        }
    }

    /**
     * Calls drawThingOnContext on each Thing in the Array.
     *
     * @param array   A listing of Things to be drawn onto the canvas.
     */
    public refillThingArray(array: IThing[]): void {
        for (const member of array) {
            this.drawThingOnContext(this.context, member);
        }
    }

    /**
     * General Function to draw a Thing onto a context. This will call
     * drawThingOnContext[Single/Multiple] with more arguments
     *
     * @param context   The context to have the Thing drawn on it.
     * @param thing   The Thing to be drawn onto the context.
     */
    public drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void {
        let left: number = getLeft(thing);
        let top: number = getTop(thing);

        if (
            thing.hidden ||
            thing.opacity < this.epsilon ||
            thing.height < 1 ||
            thing.width < 1 ||
            top > this.boundingBox.height ||
            getRight(thing) < 0 ||
            getBottom(thing) < 0 ||
            left > this.boundingBox.width
        ) {
            return;
        }

        if (thing.rotation !== undefined && thing.rotation !== 0) {
            context.save();
            context.translate(getMidX(thing), getMidY(thing));
            context.rotate(thing.rotation);
            left = -thing.width / 2;
            top = -thing.height / 2;
        }

        const sprite: SpriteSingle | SpriteMultiple = this.pixelRender.decode(
            this.generateObjectKey(thing),
            thing
        );

        if (sprite instanceof SpriteSingle) {
            this.drawThingOnContextSingle(context, thing, sprite, left, top);
        } else {
            this.drawThingOnContextMultiple(context, thing, sprite, left, top);
        }

        if (thing.rotation !== undefined && thing.rotation !== 0) {
            context.restore();
        }
    }

    /**
     * Draws a Thing's single canvas onto a context, commonly called by
     * this.drawThingOnContext.
     *
     * @param context    The context being drawn on.
     * @param thing   The Thing whose sprite is being drawn.
     * @param sprite   Container for the Thing's single sprite.
     */
    private drawThingOnContextSingle(
        context: CanvasRenderingContext2D,
        thing: IThing,
        sprite: SpriteSingle,
        left: number,
        top: number
    ): void {
        const scale: number = thing.scale || 1;
        const canvas: HTMLCanvasElement = sprite.getCanvas(thing.spritewidth, thing.spriteheight);

        if (thing.repeat) {
            this.drawPatternOnContext(
                context,
                canvas,
                left,
                top,
                thing.width,
                thing.height,
                thing.opacity || 1
            );
        } else if (thing.opacity !== 1) {
            context.globalAlpha = thing.opacity;
            context.drawImage(canvas, left, top, canvas.width * scale, canvas.height * scale);
            context.globalAlpha = 1;
        } else {
            context.drawImage(canvas, left, top, canvas.width * scale, canvas.height * scale);
        }
    }

    /**
     * Draws a Thing's multiple canvases onto a context, typically called by
     * drawThingOnContext. A variety of cases for canvases is allowed:
     * "vertical", "horizontal", and "corners".
     *
     * @param context    The context being drawn on.
     * @param thing   The Thing whose sprite is being drawn.
     * @param sprite   Container for the Thing's sprites.
     */
    private drawThingOnContextMultiple(
        context: CanvasRenderingContext2D,
        thing: IThing,
        sprite: SpriteMultiple,
        left: number,
        top: number
    ): void {
        const spriteWidth: number = thing.spritewidth;
        const spriteHeight: number = thing.spriteheight;
        const opacity: number = thing.opacity;
        const widthDrawn: number = Math.min(thing.width, spriteWidth);
        const heightDrawn: number = Math.min(thing.height, spriteHeight);
        const canvases: ICanvases = sprite.getCanvases(spriteWidth, spriteHeight);
        let topReal: number = top;
        let leftReal: number = left;
        let rightReal: number = left + thing.width;
        let bottomReal: number = top + thing.height;
        let widthReal: number = thing.width;
        let heightReal: number = thing.height;
        let canvas: HTMLCanvasElement | undefined;
        let diffhoriz: number;
        let diffvert: number;

        switch (canvases.direction) {
            // Vertical sprites may have "top", "bottom", "middle"
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if ((canvas = canvases.bottom)) {
                    diffvert = sprite.bottomheight ? sprite.bottomheight : spriteHeight;
                    this.drawPatternOnContext(
                        context,
                        canvas,
                        leftReal,
                        bottomReal - diffvert,
                        widthReal,
                        heightDrawn,
                        opacity
                    );
                    bottomReal -= diffvert;
                    heightReal -= diffvert;
                }
                // If there's a top, draw that and push down topreal
                if ((canvas = canvases.top)) {
                    diffvert = sprite.topheight ? sprite.topheight : spriteHeight;
                    this.drawPatternOnContext(
                        context,
                        canvas,
                        leftReal,
                        topReal,
                        widthReal,
                        heightDrawn,
                        opacity
                    );
                    topReal += diffvert;
                    heightReal -= diffvert;
                }
                break;

            // Horizontal sprites may have "left", "right", "middle"
            case "horizontal":
                // If there's a left, draw that and push forward leftreal
                if ((canvas = canvases.left)) {
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth : spriteWidth;
                    this.drawPatternOnContext(
                        context,
                        canvas,
                        leftReal,
                        topReal,
                        widthDrawn,
                        heightReal,
                        opacity
                    );
                    leftReal += diffhoriz;
                    widthReal -= diffhoriz;
                }
                // If there's a right, draw that and push back rightreal
                if ((canvas = canvases.right)) {
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth : spriteWidth;
                    this.drawPatternOnContext(
                        context,
                        canvas,
                        rightReal - diffhoriz,
                        topReal,
                        widthDrawn,
                        heightReal,
                        opacity
                    );
                    rightReal -= diffhoriz;
                    widthReal -= diffhoriz;
                }
                break;

            // Corner (vertical + horizontal + corner) sprites must have corners
            // In "topRight", "bottomRight", "bottomLeft", and "topLeft".
            case "corners":
                // TopLeft, left, bottomLeft
                diffvert = sprite.topheight ? sprite.topheight : spriteHeight;
                diffhoriz = sprite.leftwidth ? sprite.leftwidth : spriteWidth;
                this.drawPatternOnContext(
                    context,
                    canvases.topLeft!,
                    leftReal,
                    topReal,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    canvases.left!,
                    leftReal,
                    topReal + diffvert,
                    widthDrawn,
                    heightReal - diffvert * 2,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    canvases.bottomLeft!,
                    leftReal,
                    bottomReal - diffvert,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                leftReal += diffhoriz;
                widthReal -= diffhoriz;

                // Top, topRight
                diffhoriz = sprite.rightwidth ? sprite.rightwidth : spriteWidth;
                this.drawPatternOnContext(
                    context,
                    canvases.top!,
                    leftReal,
                    topReal,
                    widthReal - diffhoriz,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    canvases.topRight!,
                    rightReal - diffhoriz,
                    topReal,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                topReal += diffvert;
                heightReal -= diffvert;

                // Right, bottomRight, bottom
                diffvert = sprite.bottomheight ? sprite.bottomheight : spriteHeight;
                this.drawPatternOnContext(
                    context,
                    canvases.right!,
                    rightReal - diffhoriz,
                    topReal,
                    widthDrawn,
                    heightReal - diffvert,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    canvases.bottomRight!,
                    rightReal - diffhoriz,
                    bottomReal - diffvert,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    canvases.bottom!,
                    leftReal,
                    bottomReal - diffvert,
                    widthReal - diffhoriz,
                    heightDrawn,
                    opacity
                );
                rightReal -= diffhoriz;
                widthReal -= diffhoriz;
                bottomReal -= diffvert;
                heightReal -= diffvert;
                break;

            default:
                throw new Error("Unknown or missing direction given in SpriteMultiple.");
        }

        // If there's still room, draw the actual canvas
        if ((canvas = canvases.middle) && topReal < bottomReal && leftReal < rightReal) {
            if (sprite.middleStretch) {
                context.globalAlpha = opacity;
                context.drawImage(canvas, leftReal, topReal, widthReal, heightReal);
                context.globalAlpha = 1;
            } else {
                this.drawPatternOnContext(
                    context,
                    canvas,
                    leftReal,
                    topReal,
                    widthReal,
                    heightReal,
                    opacity
                );
            }
        }
    }

    /**
     * Draws a source pattern onto a context. The pattern is clipped to the size
     * of MapScreener.
     *
     * @param context   The context the pattern will be drawn onto.
     * @param source   The image being repeated as a pattern. This can be a canvas,
     *                 an image, or similar.
     * @param left   The x-location to draw from.
     * @param top   The y-location to draw from.
     * @param width   How many pixels wide the drawing area should be.
     * @param left   How many pixels high the drawing area should be.
     * @param opacity   How transparent the drawing is, in [0,1].
     */
    private drawPatternOnContext(
        context: CanvasRenderingContext2D,
        source: HTMLImageElement | HTMLCanvasElement,
        left: number,
        top: number,
        width: number,
        height: number,
        opacity: number
    ): void {
        context.globalAlpha = opacity;
        context.translate(left, top);
        context.fillStyle = context.createPattern(source, "repeat")!;
        context.fillRect(0, 0, width, height);
        context.translate(-left, -top);
        context.globalAlpha = 1;
    }
}
