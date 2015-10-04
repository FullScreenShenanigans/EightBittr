// @echo '/// <reference path="ChangeLinr-0.2.0.ts" />'
// @echo '/// <reference path="ObjectMakr-0.2.2.ts" />'
// @echo '/// <reference path="PixelRendr-0.2.0.ts" />'
// @echo '/// <reference path="QuadsKeepr-0.2.1.ts" />'
// @echo '/// <reference path="StringFilr-0.2.1.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ChangeLinr-0.2.0.ts" />
/// <reference path="References/ObjectMakr-0.2.2.ts" />
/// <reference path="References/PixelRendr-0.2.0.ts" />
/// <reference path="References/QuadsKeepr-0.2.1.ts" />
/// <reference path="References/StringFilr-0.2.1.ts" />
/// <reference path="PixelDrawr.d.ts" />
// @endif

// @include ../Source/PixelDrawr.d.ts

module PixelDrawr {
    "use strict";

    /**
     * A front-end to PixelRendr to automate drawing mass amounts of sprites to a
     * primary canvas. A PixelRendr keeps track of sprite sources, while a
     * MapScreenr maintains boundary information on the screen. Global screen 
     * refills may be done by drawing every Thing in the thingArrays, or by 
     * Quadrants as a form of dirty rectangles.
     */
    export class PixelDrawr implements IPixelDrawr {
        /**
         * A PixelRendr used to obtain raw sprite data and canvases.
         */
        private PixelRender: PixelRendr.IPixelRendr;

        /**
         * The bounds of the screen for bounds checking (often a MapScreenr).
         */
        private MapScreener: IScreenBoundaries;

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
         * String key under which Things store their height.
         */
        private keyHeight: string;

        /**
         * String key under which Things store their width.
         */
        private keyWidth: string;

        /**
         * String key under which Things store their top.
         */
        private keyTop: string;

        /**
         * String key under which Things store their right.
         */
        private keyRight: string;

        /**
         * String key under which Things store their bottom.
         */
        private keyBottom: string;

        /**
         * String key under which Things store their left.
         */
        private keyLeft: string;

        /**
         * String key under which Things store their horizontal offset.
         */
        private keyOffsetX: string;

        /**
         * String key under which Things store their vertical offset.
         */
        private keyOffsetY: string;

        /**
         * @param {IPixelDrawrSettings} settings
         */
        constructor(settings: IPixelDrawrSettings) {
            this.PixelRender = settings.PixelRender;
            this.MapScreener = settings.MapScreener;
            this.createCanvas = settings.createCanvas;

            this.unitsize = settings.unitsize || 1;
            this.noRefill = settings.noRefill;
            this.spriteCacheCutoff = settings.spriteCacheCutoff || 0;
            this.groupNames = settings.groupNames;
            this.framerateSkip = settings.framerateSkip || 1;
            this.framesDrawn = 0;
            this.epsilon = settings.epsilon || .007;

            this.keyWidth = settings.keyWidth || "width";
            this.keyHeight = settings.keyHeight || "height";
            this.keyTop = settings.keyTop || "top";
            this.keyRight = settings.keyRight || "right";
            this.keyBottom = settings.keyBottom || "bottom";
            this.keyLeft = settings.keyLeft || "left";
            this.keyOffsetX = settings.keyOffsetX;
            this.keyOffsetY = settings.keyOffsetY;

            this.generateObjectKey = settings.generateObjectKey || function (thing: IThing): string {
                return thing.toString();
            };

            this.resetBackground();
        }


        /* Simple gets
        */

        /**
         * @return {Number} How often refill calls should be skipped.
         */
        getFramerateSkip(): number {
            return this.framerateSkip;
        }

        /**
         * @return {Array[]} The Arrays to be redrawn during refill calls.
         */
        getThingArray(): IThing[][] {
            return this.thingArrays;
        }

        /**
         * @return {HTMLCanvasElement} The canvas element each Thing is to drawn on.
         */
        getCanvas(): HTMLCanvasElement {
            return this.canvas;
        }

        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the canvas.
         */
        getContext(): CanvasRenderingContext2D {
            return this.context;
        }

        /**
         * @return {HTMLCanvasElement} The canvas element used for the background.
         */
        getBackgroundCanvas(): HTMLCanvasElement {
            return this.backgroundCanvas;
        }

        /**
         * @return {CanvasRenderingContext2D} The 2D canvas context associated with
         *                                    the background canvas.
         */
        getBackgroundContext(): CanvasRenderingContext2D {
            return this.backgroundContext;
        }

        /**
         * @return {Boolean} Whether refills should skip redrawing the background 
         *                   each time.
         */
        getNoRefill(): boolean {
            return this.noRefill;
        }

        /**
         * @return {Number} The minimum opacity that will be drawn.
         */
        getEpsilon(): number {
            return this.epsilon;
        }


        /* Simple sets
        */

        /**
         * @param {Number} framerateSkip   How often refill calls should be skipped.
         */
        setFramerateSkip(framerateSkip: number): void {
            this.framerateSkip = framerateSkip;
        }

        /**
         * @param {Array[]} thingArrays   The Arrays to be redrawn during refill calls.
         */
        setThingArrays(thingArrays: IThing[][]): void {
            this.thingArrays = thingArrays;
        }

        /**
         * Sets the currently drawn canvas and context, and recreates 
         * drawThingOnContextBound.
         * 
         * @param {HTMLCanvasElement} canvas   The new primary canvas to be used.
         */
        setCanvas(canvas: HTMLCanvasElement): void {
            this.canvas = canvas;
            this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        }

        /**
         * @param {Boolean} noRefill   Whether refills should now skip redrawing the 
         *                             background each time. 
         */
        setNoRefill(noRefill: boolean): void {
            this.noRefill = noRefill;
        }

        /**
         * @param {Number} The minimum opacity that will be drawn.
         */
        setEpsilon(epsilon: number): void {
            this.epsilon = epsilon;
        }


        /* Background manipulations
        */

        /**
         * Creates a new canvas the size of MapScreener and sets the background
         * canvas to it, then recreates backgroundContext.
         */
        resetBackground(): void {
            this.backgroundCanvas = this.createCanvas(this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
            this.backgroundContext = <CanvasRenderingContext2D>this.backgroundCanvas.getContext("2d");
        }

        /**
         * Refills the background canvas with a new fillStyle.
         * 
         * @param {Mixed} fillStyle   The new fillStyle for the background context.
         */
        setBackground(fillStyle: any): void {
            this.backgroundContext.fillStyle = fillStyle;
            this.backgroundContext.fillRect(0, 0, this.MapScreener[this.keyWidth], this.MapScreener[this.keyHeight]);
        }

        /**
         * Draws the background canvas onto the main canvas' context.
         */
        drawBackground(): void {
            this.context.drawImage(this.backgroundCanvas, 0, 0);
        }


        /* Core rendering
        */

        /**
         * Goes through all the motions of finding and parsing a Thing's sprite.
         * This should be called whenever the sprite's appearance changes.
         * 
         * @param {Thing} thing   A Thing whose sprite must be updated.
         * @return {Self}
         */
        setThingSprite(thing: IThing): void {
            // If it's set as hidden, don't bother updating it
            if (thing.hidden) {
                return;
            }

            // PixelRender does most of the work in fetching the rendered sprite
            thing.sprite = this.PixelRender.decode(this.generateObjectKey(thing), thing);

            // To do: remove dependency on .numSprites
            // For now, it's used to know whether it's had its sprite set, but 
            // wouldn't physically having a .sprite do that?
            if (thing.sprite.constructor === PixelRendr.SpriteMultiple) {
                thing.numSprites = 0;
                this.refillThingCanvasMultiple(thing);
            } else {
                thing.numSprites = 1;
                this.refillThingCanvasSingle(thing);
            }
        }

        /**
         * Simply draws a thing's sprite to its canvas by getting and setting
         * a canvas::imageData object via context.getImageData(...).
         * 
         * @param {Thing} thing   A Thing whose canvas must be updated.
         */
        refillThingCanvasSingle(thing: IThing): void {
            // Don't draw small Things.
            if (<any>thing[this.keyWidth] < 1 || <any>thing[this.keyHeight] < 1) {
                return;
            }

            // Retrieve the imageData from the Thing's canvas & renderingContext
            var canvas: HTMLCanvasElement = thing.canvas,
                context: CanvasRenderingContext2D = thing.context,
                imageData: ImageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);

            // Copy the thing's sprite to that imageData and into the contextz
            this.PixelRender.memcpyU8(<Uint8ClampedArray>thing.sprite, imageData.data);
            context.putImageData(imageData, 0, 0);
        }

        /**
         * For SpriteMultiples, this copies the sprite information for each 
         * sub-sprite into its own canvas, sets thing.sprites, then draws the newly
         * rendered information onto the thing's canvas.
         * 
         * @param {Thing} thing   A Thing whose canvas and sprites must be updated.
         */
        refillThingCanvasMultiple(thing: IThing): void {
            if (thing[this.keyWidth] < 1 || thing[this.keyHeight] < 1) {
                return;
            }

            var spritesRaw: PixelRendr.SpriteMultiple = <PixelRendr.SpriteMultiple>thing.sprite,
                canvases: any = thing.canvases = {
                    "direction": spritesRaw.direction,
                    "multiple": true
                },
                canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                imageData: ImageData,
                i: string;

            thing.numSprites = 1;

            for (i in spritesRaw.sprites) {
                if (!spritesRaw.sprites.hasOwnProperty(i)) {
                    continue;
                }

                // Make a new sprite for this individual component
                canvas = this.createCanvas(thing.spritewidth * this.unitsize, thing.spriteheight * this.unitsize);
                context = <CanvasRenderingContext2D>canvas.getContext("2d");

                // Copy over this sprite's information the same way as refillThingCanvas
                imageData = context.getImageData(0, 0, canvas[this.keyWidth], canvas[this.keyHeight]);
                this.PixelRender.memcpyU8(spritesRaw.sprites[i], imageData.data);
                context.putImageData(imageData, 0, 0);

                // Record the canvas and context in thing.sprites
                canvases[i] = {
                    "canvas": canvas,
                    "context": context
                };
                thing.numSprites += 1;
            }

            // Only pre-render multiple sprites if they're below the cutoff
            if (thing[this.keyWidth] * thing[this.keyHeight] < this.spriteCacheCutoff) {
                thing.canvas[this.keyWidth] = thing[this.keyWidth] * this.unitsize;
                thing.canvas[this.keyHeight] = thing[this.keyHeight] * this.unitsize;
                this.drawThingOnContextMultiple(thing.context, thing.canvases, thing, 0, 0);
            } else {
                thing.canvas[this.keyWidth] = thing.canvas[this.keyHeight] = 0;
            }
        }


        /* Core drawing
        */

        /**
         * Called every upkeep to refill the entire main canvas. All Thing arrays
         * are made to call this.refillThingArray in order.
         */
        refillGlobalCanvas(): void {
            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }

            if (!this.noRefill) {
                this.drawBackground();
            }

            for (var i: number = 0; i < this.thingArrays.length; i += 1) {
                this.refillThingArray(this.thingArrays[i]);
            }
        }

        /**
         * Calls drawThingOnContext on each Thing in the Array.
         * 
         * @param {Thing[]} array   A listing of Things to be drawn onto the canvas.
         */
        refillThingArray(array: IThing[]): void {
            for (var i: number = 0; i < array.length; i += 1) {
                this.drawThingOnContext(this.context, array[i]);
            }
        }

        /**
         * Refills the main canvas by calling refillQuadrants on each Quadrant in
         * the groups.
         * 
         * @param {QuadrantRow[]} groups   QuadrantRows (or QuadrantCols) to be
         *                                 redrawn to the canvas.
         */
        refillQuadrantGroups(groups: QuadsKeepr.IQuadrantRow[]): void {
            var i: number;

            this.framesDrawn += 1;
            if (this.framesDrawn % this.framerateSkip !== 0) {
                return;
            }

            for (i = 0; i < groups.length; i += 1) {
                this.refillQuadrants(groups[i].quadrants);
            }
        }

        /**
         * Refills (part of) the main canvas by drawing each Quadrant's canvas onto 
         * it.
         * 
         * @param {Quadrant[]} quadrants   The Quadrants to have their canvases 
         *                                 refilled.
         */
        refillQuadrants(quadrants: QuadsKeepr.IQuadrant[]): void {
            var quadrant: QuadsKeepr.IQuadrant,
                i: number;

            for (i = 0; i < quadrants.length; i += 1) {
                quadrant = quadrants[i];
                if (
                    quadrant.changed
                    && quadrant[this.keyTop] < this.MapScreener[this.keyHeight]
                    && quadrant[this.keyRight] > 0
                    && quadrant[this.keyBottom] > 0
                    && quadrant[this.keyLeft] < this.MapScreener[this.keyWidth]) {
                    this.refillQuadrant(quadrant);
                    this.context.drawImage(quadrant.canvas, quadrant[this.keyLeft], quadrant[this.keyTop]);
                }
            }
        }

        /**
         * Refills a Quadrants's canvas by resetting its background and drawing all
         * its Things onto it.
         * 
         * @param {Quadrant} quadrant   A quadrant whose Things must be drawn onto
         *                              its canvas.
         */
        refillQuadrant(quadrant: QuadsKeepr.IQuadrant): void {
            var group: IThing[],
                i: number,
                j: number;

            // This may be what's causing such bad performance.
            if (!this.noRefill) {
                quadrant.context.drawImage(
                    this.backgroundCanvas,
                    quadrant[this.keyLeft],
                    quadrant[this.keyTop],
                    quadrant.canvas[this.keyWidth],
                    quadrant.canvas[this.keyHeight],
                    0,
                    0,
                    quadrant.canvas[this.keyWidth],
                    quadrant.canvas[this.keyHeight]);
            }

            for (i = this.groupNames.length - 1; i >= 0; i -= 1) {
                group = quadrant.things[this.groupNames[i]];

                for (j = 0; j < group.length; j += 1) {
                    this.drawThingOnQuadrant(group[j], quadrant);
                }
            }

            quadrant.changed = false;
        }

        /**
         * General Function to draw a Thing onto a context. This will call
         * drawThingOnContext[Single/Multiple] with more arguments
         * 
         * @param {CanvasRenderingContext2D} context   The context to have the Thing
         *                                             drawn on it.
         * @param {Thing} thing   The Thing to be drawn onto the context.
         */
        drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void {
            if (
                thing.hidden
                || thing.opacity < this.epsilon
                || thing[this.keyHeight] < 1
                || thing[this.keyWidth] < 1
                || this.getTop(thing) > this.MapScreener[this.keyHeight]
                || this.getRight(thing) < 0
                || this.getBottom(thing) < 0
                || this.getLeft(thing) > this.MapScreener[this.keyWidth]) {
                return;
            }

            // If Thing hasn't had a sprite yet (previously hidden), do that first
            if (typeof thing.numSprites === "undefined") {
                this.setThingSprite(thing);
            }

            // Whether or not the thing has a regular sprite or a SpriteMultiple, 
            // that sprite has already been drawn to the thing's canvas, unless it's
            // above the cutoff, in which case that logic happens now.
            if (thing.canvas[this.keyWidth] > 0) {
                this.drawThingOnContextSingle(context, thing.canvas, thing, this.getLeft(thing), this.getTop(thing));
            } else {
                this.drawThingOnContextMultiple(context, thing.canvases, thing, this.getLeft(thing), this.getTop(thing));
            }
        }

        /**
         * Draws a Thing onto a quadrant's canvas. This is a simple wrapper around
         * drawThingOnContextSingle/Multiple that also bounds checks.
         * 
         * @param {Thing} thing
         * @param {Quadrant} quadrant
         */
        drawThingOnQuadrant(thing: IThing, quadrant: QuadsKeepr.IQuadrant): void {
            if (
                thing.hidden
                || this.getTop(thing) > quadrant[this.keyBottom]
                || this.getRight(thing) < quadrant[this.keyLeft]
                || this.getBottom(thing) < quadrant[this.keyTop]
                || this.getLeft(thing) > quadrant[this.keyRight]
                || thing.opacity < this.epsilon) {
                return;
            }

            // If there's just one sprite, it's pretty simple
            if (thing.numSprites === 1) {
                return this.drawThingOnContextSingle(
                    quadrant.context,
                    thing.canvas,
                    thing,
                    this.getLeft(thing) - quadrant[this.keyLeft],
                    this.getTop(thing) - quadrant[this.keyTop]);
            } else {
                // For multiple sprites, some calculations will be needed
                return this.drawThingOnContextMultiple(
                    quadrant.context,
                    thing.canvases,
                    thing,
                    this.getLeft(thing) - quadrant[this.keyLeft],
                    this.getTop(thing) - quadrant[this.keyTop]);
            }
        }

        /**
         * Draws a Thing's single canvas onto a context, commonly called by
         * this.drawThingOnContext.
         * 
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvas   The Thing's canvas being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        drawThingOnContextSingle(
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
         * @param {CanvasRenderingContext2D} context    The context being drawn on.
         * @param {Canvas} canvases   The canvases being drawn onto the context.
         * @param {Thing} thing   The Thing whose canvas is being drawn.
         * @param {Number} left   The x-position to draw the Thing from.
         * @param {Number} top   The y-position to draw the Thing from.
         */
        drawThingOnContextMultiple(
            context: CanvasRenderingContext2D,
            canvases: IThingCanvases,
            thing: IThing,
            left: number,
            top: number): void {
            var sprite: PixelRendr.SpriteMultiple = <PixelRendr.SpriteMultiple>thing.sprite,
                topreal: number = top,
                leftreal: number = left,
                rightreal: number = left + thing.unitwidth,
                bottomreal: number = top + thing.unitheight,
                widthreal: number = thing.unitwidth,
                heightreal: number = thing.unitheight,
                spritewidthpixels: number = thing.spritewidthpixels,
                spriteheightpixels: number = thing.spriteheightpixels,
                widthdrawn: number = Math.min(widthreal, spritewidthpixels),
                heightdrawn: number = Math.min(heightreal, spriteheightpixels),
                opacity: number = thing.opacity,
                diffhoriz: number,
                diffvert: number,
                canvasref: IThingSubCanvas;

            switch (canvases.direction) {
                // Vertical sprites may have 'top', 'bottom', 'middle'
                case "vertical":
                    // If there's a bottom, draw that and push up bottomreal
                    if ((canvasref = <IThingSubCanvas>canvases[this.keyBottom])) {
                        diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(
                            context,
                            canvasref.canvas,
                            leftreal,
                            bottomreal - diffvert,
                            widthreal,
                            heightdrawn,
                            opacity);
                        bottomreal -= diffvert;
                        heightreal -= diffvert;
                    }
                    // If there's a top, draw that and push down topreal
                    if ((canvasref = <IThingSubCanvas>canvases[this.keyTop])) {
                        diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightdrawn, opacity);
                        topreal += diffvert;
                        heightreal -= diffvert;
                    }
                    break;
                // Horizontal sprites may have 'left', 'right', 'middle'
                case "horizontal":
                    // If there's a left, draw that and push forward leftreal
                    if ((canvasref = canvases[this.keyLeft])) {
                        diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthdrawn, heightreal, opacity);
                        leftreal += diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    // If there's a right, draw that and push back rightreal
                    if ((canvasref = canvases[this.keyRight])) {
                        diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                        this.drawPatternOnContext(
                            context,
                            canvasref.canvas,
                            rightreal - diffhoriz,
                            topreal,
                            widthdrawn,
                            heightreal,
                            opacity);
                        rightreal -= diffhoriz;
                        widthreal -= diffhoriz;
                    }
                    break;
                // Corner (vertical + horizontal + corner) sprites must have corners
                // in 'topRight', 'bottomRight', 'bottomLeft', and 'topLeft'.
                case "corners":
                    // topLeft, left, bottomLeft
                    diffvert = sprite.topheight ? sprite.topheight * this.unitsize : spriteheightpixels;
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(
                        context,
                        canvases.topLeft.canvas,
                        leftreal,
                        topreal,
                        widthdrawn,
                        heightdrawn,
                        opacity);
                    this.drawPatternOnContext(
                        context,
                        canvases[this.keyLeft].canvas,
                        leftreal,
                        topreal + diffvert,
                        widthdrawn,
                        heightreal - diffvert * 2,
                        opacity);
                    this.drawPatternOnContext(
                        context,
                        canvases.bottomLeft.canvas,
                        leftreal,
                        bottomreal - diffvert,
                        widthdrawn,
                        heightdrawn,
                        opacity);
                    leftreal += diffhoriz;
                    widthreal -= diffhoriz;

                    // top, topRight
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth * this.unitsize : spritewidthpixels;
                    this.drawPatternOnContext(
                        context,
                        canvases[this.keyTop].canvas,
                        leftreal,
                        topreal,
                        widthreal - diffhoriz,
                        heightdrawn,
                        opacity);
                    this.drawPatternOnContext(
                        context,
                        canvases.topRight.canvas,
                        rightreal - diffhoriz,
                        topreal,
                        widthdrawn,
                        heightdrawn,
                        opacity);
                    topreal += diffvert;
                    heightreal -= diffvert;

                    // right, bottomRight, bottom
                    diffvert = sprite.bottomheight ? sprite.bottomheight * this.unitsize : spriteheightpixels;
                    this.drawPatternOnContext(
                        context,
                        canvases[this.keyRight].canvas,
                        rightreal - diffhoriz,
                        topreal,
                        widthdrawn,
                        heightreal - diffvert,
                        opacity);
                    this.drawPatternOnContext(
                        context,
                        canvases.bottomRight.canvas,
                        rightreal - diffhoriz,
                        bottomreal - diffvert,
                        widthdrawn,
                        heightdrawn,
                        opacity);
                    this.drawPatternOnContext(
                        context,
                        canvases[this.keyBottom].canvas,
                        leftreal,
                        bottomreal - diffvert,
                        widthreal - diffhoriz,
                        heightdrawn,
                        opacity);
                    rightreal -= diffhoriz;
                    widthreal -= diffhoriz;
                    bottomreal -= diffvert;
                    heightreal -= diffvert;
                    break;
                default:
                    throw new Error("Unknown or missing direction given in SpriteMultiple.");
            }

            // If there's still room, draw the actual canvas
            if ((canvasref = canvases.middle) && topreal < bottomreal && leftreal < rightreal) {
                if (sprite.middleStretch) {
                    context.globalAlpha = opacity;
                    context.drawImage(canvasref.canvas, leftreal, topreal, widthreal, heightreal);
                    context.globalAlpha = 1;
                } else {
                    this.drawPatternOnContext(context, canvasref.canvas, leftreal, topreal, widthreal, heightreal, opacity);
                }
            }
        }


        /* Position utilities (which should almost always be optimized)
        */

        /**
         * @param {Thing} thing
         * @return {Number} The Thing's top position, accounting for vertical
         *                  offset if needed.
         */
        private getTop(thing: IThing): number {
            if (this.keyOffsetY) {
                return thing[this.keyTop] + thing[this.keyOffsetY];
            } else {
                return thing[this.keyTop];
            }
        }

        /**
         * @param {Thing} thing
         * @return {Number} The Thing's right position, accounting for horizontal 
         *                  offset if needed.
         */
        private getRight(thing: IThing): number {
            if (this.keyOffsetX) {
                return thing[this.keyRight] + thing[this.keyOffsetX];
            } else {
                return thing[this.keyRight];
            }
        }

        /**
         * @param {Thing} thing
         * @return {Number} The Thing's bottom position, accounting for vertical
         *                  offset if needed.
         */
        private getBottom(thing: IThing): number {
            if (this.keyOffsetX) {
                return thing[this.keyBottom] + thing[this.keyOffsetY];
            } else {
                return thing[this.keyBottom];
            }
        }

        /**
         * @param {Thing} thing
         * @return {Number} The Thing's left position, accounting for horizontal 
         *                  offset if needed.
         */
        private getLeft(thing: IThing): number {
            if (this.keyOffsetX) {
                return thing[this.keyLeft] + thing[this.keyOffsetX];
            } else {
                return thing[this.keyLeft];
            }
        }


        /* Utilities
        */

        /**
         * Draws a source pattern onto a context. The pattern is clipped to the size
         * of MapScreener.
         * 
         * @param {CanvasRenderingContext2D} context   The context the pattern will
         *                                             be drawn onto.
         * @param {Mixed} source   The image being repeated as a pattern. This can
         *                         be a canvas, an image, or similar.
         * @param {Number} left   The x-location to draw from.
         * @param {Number} top   The y-location to draw from.
         * @param {Number} width   How many pixels wide the drawing area should be.
         * @param {Number} left   How many pixels high the drawing area should be.
         * @param {Number} opacity   How transparent the drawing is, in [0,1].
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
}
