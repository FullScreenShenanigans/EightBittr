import { ICommand, ISpriteMultipleSettings, ISpriteSingles } from "./IPixelRendr";

/**
 * For Things with multiple sprites, the various sprite component canvases.
 */
export interface ICanvases {
    /**
     * What direction to draw in, as "vertical", "horizontal", or "corners".
     */
    direction: string;

    /**
     * A middle canvas to draw, if applicable.
     */
    middle?: HTMLCanvasElement;

    /**
     * A middle canvas to draw, if applicable.
     */
    top?: HTMLCanvasElement;

    /**
     * A right canvas to draw, if applicable.
     */
    right?: HTMLCanvasElement;

    /**
     * A bottom canvas to draw, if applicable.
     */
    bottom?: HTMLCanvasElement;

    /**
     * A left canvas to draw, if applicable.
     */
    left?: HTMLCanvasElement;

    /**
     * A top-right canvas to draw, if applicable.
     */
    topRight?: HTMLCanvasElement;

    /**
     * A bottom-right canvas to draw, if applicable.
     */
    bottomRight?: HTMLCanvasElement;

    /**
     * A bottom-left canvas to draw, if applicable.
     */
    bottomLeft?: HTMLCanvasElement;

    /**
     * A top-left canvas to draw, if applicable.
     */
    topLeft?: HTMLCanvasElement;
}

/**
 * Container for multiple child sprites.
 */
export class SpriteMultiple {
    /**
     * Storage for each internal sprite, keyed by container.
     */
    public readonly sprites: ISpriteSingles;

    /**
     * The direction of sprite, such as "horizontal".
     */
    public readonly direction: string;

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
    private canvases: ICanvases | undefined;

    /**
     * Initializes a new instance of the SpriteMultiple class.
     *
     * @param sprites   Data for each sprite to import, keyed by container.
     * @param sourceCommand    The original raw command that generated this sprite.
     */
    public constructor(sprites: ISpriteSingles, sourceCommand: ICommand) {
        const sources: ISpriteMultipleSettings = sourceCommand[2];

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
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    public getCanvases(width: number, height: number): ICanvases {
        if (!this.canvases) {
            this.canvases = this.createCanvases(width, height);
        }

        return this.canvases;
    }

    /**
     * Creates canvases for the rendered sprite.
     *
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    private createCanvases(width: number, height: number): ICanvases {
        const canvases: ICanvases = {
            direction: this.direction
        };

        for (const i in this.sprites) {
            canvases[i as keyof ICanvases] = this.sprites[i].getCanvas(width, height);
        }

        return canvases;
    }
}
