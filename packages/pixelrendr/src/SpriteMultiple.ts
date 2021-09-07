import { Command, SpriteMultipleSettings, SpriteSingles } from "./types";

/**
 * Which direction a sprite is drawing in.
 */
export type ISpriteDirection = "corners" | "horizontal" | "vertical";

/**
 * Common pattern to all patterns: just the middle.
 */
export interface IBasicPatterns {
    /**
     * A middle canvas to draw.
     */
    middle?: CanvasPattern;
}

/**
 * Patterns to be drawn in a horizontal direction.
 */
export interface IHorizontalPatterns extends IBasicPatterns {
    /**
     * Direction to draw patterns in.
     */
    direction: "horizontal";

    /**
     * A left canvas to draw.
     */
    left?: CanvasPattern;

    /**
     * A right canvas to draw.
     */
    right?: CanvasPattern;
}

/**
 * Patterns to be drawn in a horizontal direction.
 */
export interface IVerticalPatterns extends IBasicPatterns {
    /**
     * Direction to draw patterns in.
     */
    direction: "vertical";

    /**
     * A left canvas to draw.
     */
    bottom?: CanvasPattern;

    /**
     * A right canvas to draw.
     */
    top?: CanvasPattern;
}

export interface ICornersPatterns extends IBasicPatterns {
    /**
     * Direction to draw patterns in.
     */
    direction: "corners";

    /**
     * A middle canvas to draw.
     */
    top?: CanvasPattern;

    /**
     * A right canvas to draw.
     */
    right?: CanvasPattern;

    /**
     * A bottom canvas to draw.
     */
    bottom?: CanvasPattern;

    /**
     * A left canvas to draw.
     */
    left?: CanvasPattern;

    /**
     * A top-right canvas to draw.
     */
    topRight?: CanvasPattern;

    /**
     * A bottom-right canvas to draw.
     */
    bottomRight?: CanvasPattern;

    /**
     * A bottom-left canvas to draw.
     */
    bottomLeft?: CanvasPattern;

    /**
     * A top-left canvas to draw.
     */
    topLeft?: CanvasPattern;
}

/**
 * For Actors with multiple sprites, the various sprite component canvases.
 */
export type IDirectionalPatterns = ICornersPatterns | IHorizontalPatterns | IVerticalPatterns;

/**
 * Container for multiple child sprites.
 */
export class SpriteMultiple {
    /**
     * Storage for each internal sprite, keyed by container.
     */
    public readonly sprites: SpriteSingles;

    /**
     * The direction of sprite, such as "horizontal".
     */
    public readonly direction: ISpriteDirection;

    /**
     * How many pixels tall the top section is, if it exists.
     */
    public readonly topheight: number;

    /**
     * How many pixels wide the right section is, if it exists.
     */
    public readonly rightwidth: number;

    /**
     * How many pixels tall the bottom section is, if it exists.
     */
    public readonly bottomheight: number;

    /**
     * How many pixels wide the left section is, if it exists.
     */
    public readonly leftwidth: number;

    /**
     * Whether the middle section should be stretched to fill the remaining
     * space instead of filling as a pattern.
     */
    public readonly middleStretch: boolean;

    /**
     * Canvases with the rendered sprite, once created.
     */
    private patterns: IDirectionalPatterns | undefined;

    /**
     * Initializes a new instance of the SpriteMultiple class.
     *
     * @param sprites   Data for each sprite to import, keyed by container.
     * @param sourceCommand    The original raw command that generated this sprite.
     */
    public constructor(sprites: SpriteSingles, sourceCommand: Command) {
        const sources: SpriteMultipleSettings = sourceCommand[2];

        this.sprites = sprites;
        this.direction = sourceCommand[1];

        if (this.direction === "vertical" || this.direction === "corners") {
            this.topheight = (sources.topheight || 0) | 0;
            this.bottomheight = (sources.bottomheight || 0) | 0;
        }

        if (this.direction === "horizontal" || this.direction === "corners") {
            this.rightwidth = (sources.rightwidth || 0) | 0;
            this.leftwidth = (sources.leftwidth || 0) | 0;
        }

        this.middleStretch = sources.middleStretch || false;
    }

    /**
     * Gets canvases for the rendered sprite, creating it if it didn't already exist.
     *
     * @param context   ???
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    public getPatterns(
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ): IDirectionalPatterns {
        if (!this.patterns) {
            this.patterns = this.createPatterns(context, width, height);
        }

        return this.patterns;
    }

    /**
     * Creates canvases for the rendered sprite.
     *
     * @param context   ???
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    private createPatterns(
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ): IDirectionalPatterns {
        const patterns: IDirectionalPatterns = {
            direction: this.direction,
        };

        for (const i in this.sprites) {
            patterns[i as keyof Omit<IDirectionalPatterns, "direction">] = this.sprites[
                i
            ].getPattern(context, width, height);
        }

        return patterns;
    }
}
