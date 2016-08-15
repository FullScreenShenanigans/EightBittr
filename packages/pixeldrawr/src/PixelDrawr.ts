/// <reference path="../typings/PixelRendr.d.ts" />

import {
    IBoundingBox, IPixelDrawr, IPixelDrawrSettings,
    IThing, IThingCanvases, IThingSubCanvas
} from "./IPixelDrawr";

/**
 * A real-time scene drawer for large amounts of PixelRendr sprites.
 */
export class PixelDrawr implements IPixelDrawr {
    /**
     * A PixelRendr used to obtain raw sprite data and canvases.
     */
    private PixelRender: PixelRendr.IPixelRendr;

    /**
     * The bounds of the screen for bounds checking (often a MapScreenr).
     */
    private boundingBox: IBoundingBox;

    /**
     * The canvas element each Thing is to be drawn on.
     */
    private canvas: HTMLCanvasElement;

    /**
     * The 2D canvas context associated with the canvas.
     */
    private context: CanvasRenderingContext2D;

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
     * Utility Function to create a canvas.
     */
    private createCanvas: (width: number, height: number) => HTMLCanvasElement;

    /**
     * How much to scale canvases on creation.
     */
    private unitsize: number;

    /**
     * Utility Function to generate a class key for a Thing.
     */
    private generateObjectKey: (thing: IThing) => string;

    /**
     * The maximum size of a SpriteMultiple to pre-render.
     */
    private spriteCacheCutoff: number;

    /**
     * Whether refills should skip redrawing the background each time.
     */
    private noRefill: boolean;

    /**
     * For refillQuadrant, an Array of String names to refill (bottom-to-top).
     */
    private groupNames: string[];

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
        if (!settings) {
            throw new Error("No settings object given to PixelDrawr.");
        }
        if (typeof settings.PixelRender === "undefined") {
            throw new Error("No PixelRender given to PixelDrawr.");
        }
        if (typeof settings.boundingBox === "undefined") {
            throw new Error("No boundingBox given to PixelDrawr.");
        }
        if (typeof settings.createCanvas === "undefined") {
            throw new Error("No createCanvas given to PixelDrawr.");
        }

        this.PixelRender = settings.PixelRender;
        this.boundingBox = settings.boundingBox;
        this.createCanvas = settings.createCanvas;

        this.unitsize = settings.unitsize || 1;
        this.noRefill = settings.noRefill;
        this.spriteCacheCutoff = settings.spriteCacheCutoff || 0;
        this.groupNames = settings.groupNames;
        this.framerateSkip = settings.framerateSkip || 1;
        this.framesDrawn = 0;
        this.epsilon = settings.epsilon || .007;

        this.generateObjectKey = settings.generateObjectKey || function (thing: IThing): string {
            return thing.toString();
        };

        this.resetBackground();
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
    public getThingArray(): IThing[][] {
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
     * Sets the currently drawn canvas and context, and recreates 
     * drawThingOnContextBound.
     * 
     * @param canvas   The new primary canvas to be used.
     */
    public setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
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
        this.backgroundCanvas = this.createCanvas(this.boundingBox.width, this.boundingBox.height);
        this.backgroundContext = this.backgroundCanvas.getContext("2d");
    }

    /**
     * Refills the background canvas with a new fillStyle.
     * 
     * @param fillStyle   The new fillStyle for the background context.
     */
    public setBackground(fillStyle: any): void {
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
     * Goes through all the motions of finding and parsing a Thing's sprite.
     * This should be called whenever the sprite's appearance changes.
     * 
     * @param thing   A Thing whose sprite must be updated.
     */
    public setThingSprite(thing: IThing): void {
        // If it's set as hidden, don't bother updating it
        if (thing.hidden) {
            return;
        }

        // PixelRender does most of the work in fetching the rendered sprite
        thing.sprite = this.PixelRender.decode(this.generateObjectKey(thing), thing);

        // To do: remove dependency on .numSprites
        // For now, it's used to know whether it's had its sprite set, but 
        // wouldn't physically having a .sprite do that?
        if (thing.sprite instanceof PixelRendr.SpriteMultiple) {
            thing.numSprites = 0;
            this.refillThingCanvasMultiple(thing);
        } else {
            thing.numSprites = 1;
            this.refillThingCanvasSingle(thing);
        }
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

        for (let i: number = 0; i < this.thingArrays.length; i += 1) {
            this.refillThingArray(this.thingArrays[i]);
        }
    }

    /**
     * Calls drawThingOnContext on each Thing in the Array.
     * 
     * @param array   A listing of Things to be drawn onto the canvas.
     */
    public refillThingArray(array: IThing[]): void {
        for (let i: number = 0; i < array.length; i += 1) {
            this.drawThingOnContext(this.context, array[i]);
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
        if (
            thing.hidden
            || thing.opacity < this.epsilon
            || thing.height < 1
            || thing.width < 1
            || this.getTop(thing) > this.boundingBox.height
            || this.getRight(thing) < 0
            || this.getBottom(thing) < 0
            || this.getLeft(thing) > this.boundingBox.width) {
            return;
        }

        // If Thing hasn't had a sprite yet (previously hidden), do that first
        if (typeof thing.numSprites === "undefined") {
            this.setThingSprite(thing);
        }

        // Whether or not the thing has a regular sprite or a SpriteMultiple, 
        // that sprite has already been drawn to the thing's canvas, unless it's
        // above the cutoff, in which case that logic happens now.
        if (thing.canvas.width > 0) {
            this.drawThingOnContextSingle(context, thing.canvas, thing, this.getLeft(thing), this.getTop(thing));
        } else {
            this.drawThingOnContextMultiple(context, thing.canvases, thing, this.getLeft(thing), this.getTop(thing));
        }
    }

    /**
     * Simply draws a thing's sprite to its canvas by getting and setting
     * a canvas::imageData object via context.getImageData(...).
     * 
     * @param thing   A Thing whose canvas must be updated.
     */
    private refillThingCanvasSingle(thing: IThing): void {
        // Don't draw small Things.
        if (thing.width < 1 || thing.height < 1) {
            return;
        }

        // Retrieve the imageData from the Thing's canvas & renderingContext
        const canvas: HTMLCanvasElement = thing.canvas;
        const context: CanvasRenderingContext2D = thing.context;
        const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Copy the thing's sprite to that imageData and into the contextz
        this.PixelRender.memcpyU8(thing.sprite as Uint8ClampedArray, imageData.data);
        context.putImageData(imageData, 0, 0);
    }

    /**
     * For SpriteMultiples, this copies the sprite information for each 
     * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
     * rendered information onto the thing's canvas.
     * 
     * @param thing   A Thing whose canvas and sprites must be updated.
     */
    private refillThingCanvasMultiple(thing: IThing): void {
        if (thing.width < 1 || thing.height < 1) {
            return;
        }

        const spritesRaw: PixelRendr.ISpriteMultiple = thing.sprite as PixelRendr.ISpriteMultiple;
        const canvases: IThingCanvases = thing.canvases = {
            direction: spritesRaw.direction,
            multiple: true
        };
            // canvas: HTMLCanvasElement,
            // context: CanvasRenderingContext2D,
            // imageData: ImageData,
            // i: string;

        thing.numSprites = 1;

        for (const i in spritesRaw.sprites) {
            if (!spritesRaw.sprites.hasOwnProperty(i)) {
                continue;
            }

            // Make a new sprite for this individual component
            const canvas: HTMLCanvasElement = this.createCanvas(thing.spritewidth * this.unitsize, thing.spriteheight * this.unitsize);
            const context: CanvasRenderingContext2D = canvas.getContext("2d");

            // Copy over this sprite's information the same way as refillThingCanvas
            const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
            this.PixelRender.memcpyU8(spritesRaw.sprites[i], imageData.data);
            context.putImageData(imageData, 0, 0);

            // Record the canvas and context in thing.sprites
            (canvases as any)[i] = {
                canvas: canvas,
                context: context
            };

            thing.numSprites += 1;
        }

        // Only pre-render multiple sprites if they're below the cutoff
        if (thing.width * thing.height < this.spriteCacheCutoff) {
            thing.canvas.width = thing.width * this.unitsize;
            thing.canvas.height = thing.height * this.unitsize;
            this.drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
        } else {
            thing.canvas.width = thing.canvas.height = 0;
        }
    }

    /**
     * Draws a Thing's single canvas onto a context, commonly called by
     * this.drawThingOnContext.
     * 
     * @param context    The context being drawn on.
     * @param canvas   The Thing's canvas being drawn onto the context.
     * @param thing   The Thing whose canvas is being drawn.
     * @param left   The x-position to draw the Thing from.
     * @param top   The y-position to draw the Thing from.
     */
    private drawThingOnContextSingle(
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        thing: IThing,
        left: number,
        top: number): void {
        // If the sprite should repeat, use the pattern equivalent
        if (thing.repeat) {
            this.drawPatternOnContext(context, canvas, left, top, thing.unitwidth, thing.unitheight, thing.opacity || 1);
        } else if (thing.opacity !== 1) {
            // Opacities not equal to one must reset the context afterwards
            context.globalAlpha = thing.opacity;
            context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
            context.globalAlpha = 1;
        } else {
            context.drawImage(canvas, left, top, canvas.width * thing.scale, canvas.height * thing.scale);
        }
    }

    /**
     * Draws a Thing's multiple canvases onto a context, typicall called by
     * drawThingOnContext. A variety of cases for canvases is allowed:
     * "vertical", "horizontal", and "corners".
     * 
     * @param context    The context being drawn on.
     * @param canvases   The canvases being drawn onto the context.
     * @param thing   The Thing whose canvas is being drawn.
     * @param left   The x-position to draw the Thing from.
     * @param top   The y-position to draw the Thing from.
     */
    private drawThingOnContextMultiple(
        context: CanvasRenderingContext2D,
        canvases: IThingCanvases,
        thing: IThing,
        left: number,
        top: number): void {
        const sprite: PixelRendr.ISpriteMultiple = thing.sprite as PixelRendr.ISpriteMultiple;
        const spriteWidthPixels: number = thing.spritewidthpixels;
        const spriteHeightPixels: number = thing.spriteheightpixels;
        const opacity: number = thing.opacity;
        let topReal: number = top;
        let leftReal: number = left;
        let rightReal: number = left + thing.unitwidth;
        let bottomReal: number = top + thing.unitheight;
        let widthReal: number = thing.unitwidth;
        let heightReal: number = thing.unitheight;
        let canvasref: IThingSubCanvas;
        let diffhoriz: number;
        let diffvert: number;
        const widthDrawn: number = Math.min(widthReal, spriteWidthPixels);
        const heightDrawn: number = Math.min(heightReal, spriteHeightPixels);

        /* tslint:disable no-conditional-assignment */
        switch (canvases.direction) {
            // Vertical sprites may have "top", "bottom", "middle"
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if ((canvasref = canvases.bottom)) {
                    diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteHeightPixels;
                    this.drawPatternOnContext(
                        context,
                        canvasref.canvas,
                        leftReal,
                        bottomReal - diffvert,
                        widthReal,
                        heightDrawn,
                        opacity);
                    bottomReal -= diffvert;
                    heightReal -= diffvert;
                }
                // If there's a top, draw that and push down topreal
                if ((canvasref = canvases.top)) {
                    diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteHeightPixels;
                    this.drawPatternOnContext(context, canvasref.canvas, leftReal, topReal, widthReal, heightDrawn, opacity);
                    topReal += diffvert;
                    heightReal -= diffvert;
                }
                break;

            // Horizontal sprites may have "left", "right", "middle"
            case "horizontal":
                // If there's a left, draw that and push forward leftreal
                if ((canvasref = canvases.left)) {
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spriteWidthPixels;
                    this.drawPatternOnContext(context, canvasref.canvas, leftReal, topReal, widthDrawn, heightReal, opacity);
                    leftReal += diffhoriz;
                    widthReal -= diffhoriz;
                }
                // If there's a right, draw that and push back rightreal
                if ((canvasref = canvases.right)) {
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spriteWidthPixels;
                    this.drawPatternOnContext(
                        context,
                        canvasref.canvas,
                        rightReal - diffhoriz,
                        topReal,
                        widthDrawn,
                        heightReal,
                        opacity);
                    rightReal -= diffhoriz;
                    widthReal -= diffhoriz;
                }
                break;

            // Corner (vertical + horizontal + corner) sprites must have corners
            // in "topRight", "bottomRight", "bottomLeft", and "topLeft".
            case "corners":
                // topLeft, left, bottomLeft
                diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteHeightPixels;
                diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spriteWidthPixels;
                this.drawPatternOnContext(
                    context,
                    canvases.topLeft.canvas,
                    leftReal,
                    topReal,
                    widthDrawn,
                    heightDrawn,
                    opacity);
                this.drawPatternOnContext(
                    context,
                    canvases.left.canvas,
                    leftReal,
                    topReal + diffvert,
                    widthDrawn,
                    heightReal - diffvert * 2,
                    opacity);
                this.drawPatternOnContext(
                    context,
                    canvases.bottomLeft.canvas,
                    leftReal,
                    bottomReal - diffvert,
                    widthDrawn,
                    heightDrawn,
                    opacity);
                leftReal += diffhoriz;
                widthReal -= diffhoriz;

                // top, topRight
                diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spriteWidthPixels;
                this.drawPatternOnContext(
                    context,
                    canvases.top.canvas,
                    leftReal,
                    topReal,
                    widthReal - diffhoriz,
                    heightDrawn,
                    opacity);
                this.drawPatternOnContext(
                    context,
                    canvases.topRight.canvas,
                    rightReal - diffhoriz,
                    topReal,
                    widthDrawn,
                    heightDrawn,
                    opacity);
                topReal += diffvert;
                heightReal -= diffvert;

                // right, bottomRight, bottom
                diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteHeightPixels;
                this.drawPatternOnContext(
                    context,
                    canvases.right.canvas,
                    rightReal - diffhoriz,
                    topReal,
                    widthDrawn,
                    heightReal - diffvert,
                    opacity);
                this.drawPatternOnContext(
                    context,
                    canvases.bottomRight.canvas,
                    rightReal - diffhoriz,
                    bottomReal - diffvert,
                    widthDrawn,
                    heightDrawn,
                    opacity);
                this.drawPatternOnContext(
                    context,
                    canvases.bottom.canvas,
                    leftReal,
                    bottomReal - diffvert,
                    widthReal - diffhoriz,
                    heightDrawn,
                    opacity);
                rightReal -= diffhoriz;
                widthReal -= diffhoriz;
                bottomReal -= diffvert;
                heightReal -= diffvert;
                break;

            default:
                throw new Error("Unknown or missing direction given in SpriteMultiple.");
        }

        // If there's still room, draw the actual canvas
        if ((canvasref = canvases.middle) && topReal < bottomReal && leftReal < rightReal) {
            if (sprite.middleStretch) {
                context.globalAlpha = opacity;
                context.drawImage(canvasref.canvas, leftReal, topReal, widthReal, heightReal);
                context.globalAlpha = 1;
            } else {
                this.drawPatternOnContext(context, canvasref.canvas, leftReal, topReal, widthReal, heightReal, opacity);
            }
        }
        /* tslint:enable no-conditional-assignment */
    }

    /**
     * @param thing   Any Thing.
     * @returns The Thing's top position, accounting for vertical offset if needed.
     */
    private getTop(thing: IThing): number {
        if (thing.offsetY) {
            return thing.top + thing.offsetY;
        } else {
            return thing.top;
        }
    }

    /**
     * @param thing   Any Thing.
     * @returns The Thing's right position, accounting for horizontal offset if needed.
     */
    private getRight(thing: IThing): number {
        if (thing.offsetX) {
            return thing.right + thing.offsetX;
        } else {
            return thing.right;
        }
    }

    /**
     * @param thing   Any Thing.
     * @returns {Number} The Thing's bottom position, accounting for vertical
     *                  offset if needed.
     */
    private getBottom(thing: IThing): number {
        if (thing.offsetX) {
            return thing.bottom + thing.offsetY;
        } else {
            return thing.bottom;
        }
    }

    /**
     * @param thing   Any Thing.
     * @returns The Thing's left position, accounting for horizontal offset if needed.
     */
    private getLeft(thing: IThing): number {
        if (thing.offsetX) {
            return thing.left + thing.offsetX;
        } else {
            return thing.left;
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
        source: any,
        left: number,
        top: number,
        width: number,
        height: number,
        opacity: number): void {
        context.globalAlpha = opacity;
        context.translate(left, top);
        context.fillStyle = context.createPattern(source, "repeat");
        context.fillRect(
            0, 0,
            // Math.max(width, left - MapScreener[keyRight]),
            // Math.max(height, top - MapScreener[keyBottom])
            width, height);
        context.translate(-left, -top);
        context.globalAlpha = 1;
    }
}
