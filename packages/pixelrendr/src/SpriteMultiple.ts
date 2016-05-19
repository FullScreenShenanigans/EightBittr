import { IClampedArraysContainer, IRender, ISpriteMultiple, ISpriteMultipleSettings } from "./IPixelRendr";

/**
 * Container for multiple sprite sections of Uint8ClampedArray of data.
 */
export class SpriteMultiple implements ISpriteMultiple {
    /**
     * Storage for each internal Uint8ClampedArray sprite, keyed by container.
     */
    public sprites: IClampedArraysContainer;

    /**
     * The direction of sprite, such as "horizontal".
     */
    public direction: string;

    /**
     * How many pixels tall the top section is, if it exists.
     */
    public topheight: number;

    /**
     * How many pixels wide the right section is, if it exists.
     */
    public rightwidth: number;

    /**
     * How many pixels tall the bottom section is, if it exists.
     */
    public bottomheight: number;

    /**
     * How many pixels wide the left section is, if it exists.
     */
    public leftwidth: number;

    /**
     * Whether the middle section should be stretched to fill the remaining
     * space instead of filling as a pattern.
     */
    public middleStretch: boolean;

    /**
     * Initializes a new instance of the SpriteMultiple class.
     *
     * @param sprites   Data for each sprite to import, keyed by container.
     * @param render   The parsed sprite source.
     */
    public constructor(sprites: IClampedArraysContainer, render: IRender) {
        const sources: ISpriteMultipleSettings = render.source[2];

        this.sprites = sprites;
        this.direction = render.source[1];

        if (this.direction === "vertical" || this.direction === "corners") {
            this.topheight = sources.topheight | 0;
            this.bottomheight = sources.bottomheight | 0;
        }

        if (this.direction === "horizontal" || this.direction === "corners") {
            this.rightwidth = sources.rightwidth | 0;
            this.leftwidth = sources.leftwidth | 0;
        }

        this.middleStretch = sources.middleStretch || false;
    }
}
