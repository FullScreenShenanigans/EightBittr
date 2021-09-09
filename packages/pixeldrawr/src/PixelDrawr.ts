import { PixelRendr, SpriteMultiple, SpriteSingle } from "pixelrendr";
import { DrawingContexts } from ".";

import { BoundingBox, PixelDrawrSettings, Actor } from "./types";

/**
 * @param actor   Any Actor.
 * @returns The Actor's top position, accounting for vertical offset if needed.
 */
const getTop = (actor: Actor) => (actor.top + (actor.offsetY || 0)) | 0;

/**
 * @param actor   Any Actor.
 * @returns The Actor's right position, accounting for horizontal offset if needed.
 */
const getRight = (actor: Actor) => (actor.right + (actor.offsetX || 0)) | 0;

/**
 * @param actor   Any Actor.
 * @returns The Actor's bottom position, accounting for vertical offset if needed.
 */
const getBottom = (actor: Actor) => (actor.bottom + (actor.offsetY || 0)) | 0;

/**
 * @param actor   Any Actor.
 * @returns The Actor's left position, accounting for horizontal offset if needed.
 */
const getLeft = (actor: Actor) => (actor.left + (actor.offsetX || 0)) | 0;

/**
 * @param actor   Any Actor.
 * @returns The Actor's horizontal center, accounting for horizontal offset if needed.
 */
const getMidX = (actor: Actor) => (getLeft(actor) + actor.width / 2) | 0;

/**
 * @param actor   Any Actor.
 * @returns The Actor's vertical center, accounting for vertical offset if needed.
 */
const getMidY = (actor: Actor) => (getTop(actor) + actor.height / 2) | 0;

/**
 * Real-time scene drawer for PixelRendr sprites.
 */
export class PixelDrawr {
    /**
     * Arrays of Actor[]s that are to be drawn in each refill.
     */
    private readonly actorArrays: Actor[][];

    /**
     * The bounds of the screen for bounds checking (often a MapScreenr).
     */
    private readonly boundingBox: BoundingBox;

    /**
     * Background and foreground contexts and sizing to draw on them within.
     */
    private readonly contexts: DrawingContexts;

    /**
     * An arbitrarily small minimum for opacity to be completely transparent.
     */
    private readonly epsilon: number;

    /**
     * Utility Function to generate a class key for an actor.
     */
    private readonly generateObjectKey: (actor: Actor) => string;

    /**
     * A PixelRendr used to obtain raw sprite data and canvases.
     */
    private readonly pixelRender: PixelRendr;

    /**
     * How often the screen redraws (1 for always, 2 for every other call, etc).
     */
    private framerateSkip: number;

    /**
     * How many frames have been drawn so far.
     */
    private framesDrawn: number;

    /**
     * Initializes a new instance of the PixelDrawr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: PixelDrawrSettings) {
        this.boundingBox = settings.boundingBox;
        this.contexts = settings.contexts;
        this.generateObjectKey = settings.generateObjectKey;
        this.pixelRender = settings.pixelRender;

        this.framerateSkip = settings.framerateSkip || 1;
        this.framesDrawn = 0;
        this.epsilon = settings.epsilon || 0.007;
        this.actorArrays = settings.actorArrays || [];

        if (settings.background) {
            this.setBackground(settings.background);
        }
    }

    /**
     * @param framerateSkip   How often refill calls should be skipped.
     */
    public setFramerateSkip(framerateSkip: number): void {
        this.framerateSkip = framerateSkip;
    }

    /**
     * Refills the background canvas with a new fillStyle.
     *
     * @param fillStyle   The new fillStyle for the background context.
     */
    public setBackground(fillStyle: string | CanvasGradient | CanvasPattern): void {
        this.contexts.background.fillStyle = fillStyle;
        this.contexts.background.fillRect(0, 0, this.boundingBox.width, this.boundingBox.height);
    }

    /**
     * Called every upkeep to refill the entire main canvas. All Actor arrays
     * are made to call this.refillActorArray in order.
     */
    public refillGlobalCanvas(): void {
        this.framesDrawn += 1;
        if (this.framesDrawn % this.framerateSkip !== 0) {
            return;
        }

        this.contexts.foreground.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);

        for (const array of this.actorArrays) {
            this.refillActorArray(array);
        }
    }

    /**
     * Calls drawActorOnContext on each Actor in the Array.
     *
     * @param array   A listing of Actors to be drawn onto the canvas.
     */
    private refillActorArray(array: Actor[]): void {
        for (const member of array) {
            this.drawActorOnContext(this.contexts.foreground, member);
        }
    }

    /**
     * General Function to draw an Actor onto a context. This will call
     * drawActorOnContext[Single/Multiple] with more arguments
     *
     * @param context   The context to have The Actor drawn on it.
     * @param Actor   The Actor to be drawn onto the context.
     */
    private drawActorOnContext(context: CanvasRenderingContext2D, actor: Actor): void {
        let left = getLeft(actor);
        let top = getTop(actor);

        if (
            actor.hidden ||
            actor.opacity < this.epsilon ||
            actor.height < 1 ||
            actor.width < 1 ||
            top > this.boundingBox.height ||
            getRight(actor) < 0 ||
            getBottom(actor) < 0 ||
            left > this.boundingBox.width
        ) {
            return;
        }

        if (actor.rotation !== undefined && actor.rotation !== 0) {
            context.save();
            context.translate(getMidX(actor), getMidY(actor));
            context.rotate(actor.rotation);
            left = -actor.width / 2;
            top = -actor.height / 2;
        }

        const sprite = this.pixelRender.decode(this.generateObjectKey(actor), actor);

        if (sprite instanceof SpriteSingle) {
            this.drawActorOnContextSingle(context, actor, sprite, left, top);
        } else {
            this.drawActorOnContextMultiple(context, actor, sprite, left, top);
        }

        if (actor.rotation !== undefined && actor.rotation !== 0) {
            context.restore();
        }
    }

    /**
     * Draws an Actor's single canvas onto a context, commonly called by
     * this.drawActorOnContext.
     *
     * @param context    The context being drawn on.
     * @param Actor   The Actor whose sprite is being drawn.
     * @param sprite   Container for The Actor's single sprite.
     */
    private drawActorOnContextSingle(
        context: CanvasRenderingContext2D,
        actor: Actor,
        sprite: SpriteSingle,
        left: number,
        top: number
    ): void {
        const scale = actor.scale || 1;

        if (actor.repeat) {
            this.drawPatternOnContext(
                context,
                sprite.getPattern(context, actor.spritewidth, actor.spriteheight),
                left,
                top,
                actor.width,
                actor.height,
                actor.opacity || 1
            );
            return;
        }

        const canvas = sprite.getCanvas(actor.spritewidth, actor.spriteheight);

        if (actor.opacity !== 1) {
            context.globalAlpha = actor.opacity;
            context.drawImage(canvas, left, top, canvas.width * scale, canvas.height * scale);
            context.globalAlpha = 1;
        } else {
            context.drawImage(canvas, left, top, canvas.width * scale, canvas.height * scale);
        }
    }

    /**
     * Draws an Actor's multiple canvases onto a context, typically called by
     * drawActorOnContext. A variety of cases for canvases is allowed:
     * "vertical", "horizontal", and "corners".
     *
     * @param context    The context being drawn on.
     * @param Actor   The Actor whose sprite is being drawn.
     * @param sprite   Container for The Actor's sprites.
     */
    private drawActorOnContextMultiple(
        context: CanvasRenderingContext2D,
        actor: Actor,
        sprite: SpriteMultiple,
        left: number,
        top: number
    ): void {
        const spriteWidth = actor.spritewidth;
        const spriteHeight = actor.spriteheight;
        const opacity = actor.opacity;
        const widthDrawn = Math.min(actor.width, spriteWidth);
        const heightDrawn = Math.min(actor.height, spriteHeight);
        const patterns = sprite.getPatterns(context, spriteWidth, spriteHeight);
        let topReal = top;
        let leftReal = left;
        let rightReal = left + actor.width;
        let bottomReal = top + actor.height;
        let widthReal = actor.width;
        let heightReal = actor.height;
        let diffhoriz: number;
        let diffvert: number;

        switch (patterns.direction) {
            case "vertical":
                // If there's a bottom, draw that and push up bottomreal
                if (patterns.bottom) {
                    diffvert = sprite.bottomheight ? sprite.bottomheight : spriteHeight;
                    this.drawPatternOnContext(
                        context,
                        patterns.bottom,
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
                if (patterns.top) {
                    diffvert = sprite.topheight ? sprite.topheight : spriteHeight;
                    this.drawPatternOnContext(
                        context,
                        patterns.top,
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
                if (patterns.left) {
                    diffhoriz = sprite.leftwidth ? sprite.leftwidth : spriteWidth;
                    this.drawPatternOnContext(
                        context,
                        patterns.left,
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
                if (patterns.right) {
                    diffhoriz = sprite.rightwidth ? sprite.rightwidth : spriteWidth;
                    this.drawPatternOnContext(
                        context,
                        patterns.right,
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

            case "corners":
                // TopLeft, left, bottomLeft
                diffvert = sprite.topheight ? sprite.topheight : spriteHeight;
                diffhoriz = sprite.leftwidth ? sprite.leftwidth : spriteWidth;
                this.drawPatternOnContext(
                    context,
                    patterns.topLeft!,
                    leftReal,
                    topReal,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    patterns.left!,
                    leftReal,
                    topReal + diffvert,
                    widthDrawn,
                    heightReal - diffvert * 2,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    patterns.bottomLeft!,
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
                    patterns.top!,
                    leftReal,
                    topReal,
                    widthReal - diffhoriz,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    patterns.topRight!,
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
                    patterns.right!,
                    rightReal - diffhoriz,
                    topReal,
                    widthDrawn,
                    heightReal - diffvert,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    patterns.bottomRight!,
                    rightReal - diffhoriz,
                    bottomReal - diffvert,
                    widthDrawn,
                    heightDrawn,
                    opacity
                );
                this.drawPatternOnContext(
                    context,
                    patterns.bottom!,
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
        }

        // If there's still room, draw the middle of the canvas
        if (patterns.middle && topReal < bottomReal && leftReal < rightReal) {
            this.drawPatternOnContext(
                context,
                patterns.middle,
                leftReal,
                topReal,
                widthReal,
                heightReal,
                opacity
            );
        }
    }

    /**
     * Draws a source pattern onto a context. The pattern is clipped to the size
     * of MapScreener.
     *
     * @param context   The context the pattern will be drawn onto.
     * @param pattern   Canvas pattern to be drawn onto the context.
     * @param left   The x-location to draw from.
     * @param top   The y-location to draw from.
     * @param width   How many pixels wide the drawing area should be.
     * @param left   How many pixels high the drawing area should be.
     * @param opacity   How transparent the drawing is, in [0,1].
     */
    private drawPatternOnContext(
        context: CanvasRenderingContext2D,
        pattern: CanvasPattern,
        left: number,
        top: number,
        width: number,
        height: number,
        opacity: number
    ): void {
        if (opacity !== 1) {
            context.globalAlpha = opacity;
        }

        context.translate(left, top);
        context.fillStyle = pattern;
        context.fillRect(0, 0, width, height);
        context.translate(-left, -top);

        if (opacity !== 1) {
            context.globalAlpha = 1;
        }
    }
}
