declare module PixelDrawr {
    /**
     * A typed array of 8-bit unsigned integer values. The contents are initialized 
     * to 0. If the requested number of bytes could not be allocated an exception is
     * raised.
     */
    interface Uint8ClampedArray extends ArrayBufferView {
        [index: number]: number;

        /**
          * The size in bytes of each element in the array. 
          */
        BYTES_PER_ELEMENT: number;

        /**
          * The length of the array.
          */
        length: number;

        /**
          * Gets the element at the specified index.
          * 
          * @param {Number} index The index at which to get the element of the array.
          */
        get(index: number): number;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Number} index   The index of the location to set.
          * @param {Number} value   The value to set.
          */
        set(index: number, value: number): void;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Uint8ClampedArray} array   A typed or untyped array of values 
          *                                    to set.
          * @param {Number} [offset]   The index in the current array at which the 
          *                            values are to be written.
          */
        set(array: Uint8ClampedArray, offset?: number): void;

        /**
          * Sets a value or an array of values.
          * 
          * @param {Number[]} array   A typed or untyped array of values to set.
          * @param {Number} [offset]   The index in the current array at which the 
          *                            values are to be written.
          */
        set(array: number[], offset?: number): void;

        /**
          * Gets a new Uint8ClampedArray view of the ArrayBuffer Object store for 
          * this array, specifying the first and last members of the subarray. 
          * 
          * @param {Number} begin   The index of the beginning of the array.
          * @param {Number} end   The index of the end of the array.
          */
        subarray(begin: number, end?: number): Uint8ClampedArray;
    }

    var Uint8ClampedArray: {
        prototype: Uint8ClampedArray;
        new (length: number): Uint8ClampedArray;
        new (array: Uint8ClampedArray): Uint8ClampedArray;
        new (array: number[]): Uint8ClampedArray;
        new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
        BYTES_PER_ELEMENT: number;
    }

    export interface IScreenBoundaries {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }

    export interface IThingCanvases {
        direction: string;
        multiple: boolean;
        middle?: IThingSubCanvas;
        top?: IThingSubCanvas;
        right?: IThingSubCanvas;
        bottom?: IThingSubCanvas;
        left?: IThingSubCanvas;
        topRight?: IThingSubCanvas;
        bottomRight?: IThingSubCanvas;
        bottomLeft?: IThingSubCanvas;
        topLeft?: IThingSubCanvas;
    }

    export interface IThingSubCanvas {
        "canvas": HTMLCanvasElement;
        "context": CanvasRenderingContext2D;
    }

    export interface IThing {
        /**
         * The sprite for this Thing to have drawn.
         */
        sprite: Uint8ClampedArray | PixelRendr.ISpriteMultiple;

        /**
         * The canvas upon which the Thing's sprite is to be drawn.
         */
        canvas: HTMLCanvasElement;

        /**
         * For Things with multiple sprites, the various sprite component canvases.
         */
        canvases?: IThingCanvases;

        /**
         * The rendering context used to draw the Thing's sprite on its canvas.
         */
        context: CanvasRenderingContext2D;

        /**
         * Whether this shouldn't be drawn (is completely hidden).
         */
        hidden: boolean;

        /**
         * How transparent this is, in [0, 1].
         */
        opacity: number;

        /**
         * How many sprites this has (1 for regular, 0 or >1 for multiple).
         */
        numSprites?: number;

        /**
         * Whether the Thing's sprite should repeat across large canvases.
         */
        repeat?: boolean;

        /**
         * How much to expand the Thing's sprite size (by default, 1 for not at all).
         */
        scale?: number;

        /**
         * Width in game pixels, equal to width * unitsize.
         */
        unitwidth?: number;

        /**
         * Height in game pixels, equal to height * unitsize.
         */
        unitheight?: number;

        /**
         * How many pixels wide the output sprite should be.
         */
        spritewidth: number;

        /**
         * How many pixels high the output sprite should be.
         */
        spriteheight: number;

        /**
         * Sprite width in real-life pixels, equal to spritewidth * scale.
         */
        spritewidthpixels?: number;

        /**
         * Sprite height in real-life pixels, equal to spritewidth * scale.
         */
        spriteheightpixels?: number;
    }

    export interface IPixelDrawrSettings {
        /**
         * The PixelRendr used for sprite lookups and generation.
         */
        PixelRender: PixelRendr.IPixelRendr;

        /**
         * The bounds of the screen for bounds checking (typically a MapScreenr).
         */
        MapScreener: IScreenBoundaries;

        /**
         * A Function to create a canvas of a given width and height.
         */
        createCanvas: (width: number, height: number) => HTMLCanvasElement;

        /**
         * How much to scale canvases on creation (by default, 1 for not at all).
         */
        unitsize?: number;

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
         * The names of groups to refill (only used if using Quadrant refilling).
         */
        groupNames?: string[];

        /**
         * How often to draw frames (by default, 1 for every time).
         */
        framerateSkip?: number;

        /**
         * How to generat ekeys to retrieve sprites from the PixelRendr (by default,
         * Object.toString).
         */
        generateObjectKey?: (thing: IThing) => string;

        /**
         * An arbitrarily small minimum opacity for a Thing to be considered not
         * completely transparent (by default, .007).
         */
        epsilon?: number;

        /**
         * The attribute name for a Thing's width (by default, "width").
         */
        keyWidth?: string;

        /**
         * The attribute name for a Thing's height (by default, "height").
         */
        keyHeight?: string;

        /**
         * The attribute name for a Thing's top (by default, "top").
         */
        keyTop?: string;

        /**
         * The attribute name for a Thing's right (by default, "right").
         */
        keyRight?: string;

        /**
         * The attribute name for a Thing's bottom (by default, "bottom").
         */
        keyBottom?: string;

        /**
         * The attribute name for a Thing's left (by default, "left").
         */
        keyLeft?: string;

        /**
         * The attribute name for a Thing's horizontal offest (by default, ignored).
         */
        keyOffsetX?: string;

        /**
         * The attribute name for a Thing's vertical offset(by default, ignored).
         */
        keyOffsetY?: string;
    }

    export interface IPixelDrawr {
        getFramerateSkip(): number;
        getThingArray(): IThing[][];
        getCanvas(): HTMLCanvasElement;
        getContext(): CanvasRenderingContext2D;
        getBackgroundCanvas(): HTMLCanvasElement;
        getBackgroundContext(): CanvasRenderingContext2D;
        getNoRefill(): boolean;
        getEpsilon(): number;
        setFramerateSkip(framerateSkip: number): void;
        setThingArrays(thingArrays: IThing[][]): void;
        setCanvas(canvas: HTMLCanvasElement): void;
        setNoRefill(noRefill: boolean): void;
        setEpsilon(epsilon: number): void;
        resetBackground(): void;
        setBackground(fillStyle: any): void;
        drawBackground(): void;
        setThingSprite(thing: IThing): void;
        refillThingCanvasSingle(thing: IThing): void;
        refillThingCanvasMultiple(thing: IThing): void;
        refillGlobalCanvas(): void;
        refillThingArray(array: IThing[]): void;
        refillQuadrantGroups(groups: QuadsKeepr.IQuadrantRow[]): void;
        refillQuadrants(quadrants: QuadsKeepr.IQuadrant[]): void;
        refillQuadrant(quadrant: QuadsKeepr.IQuadrant): void;
        drawThingOnContext(context: CanvasRenderingContext2D, thing: IThing): void;
        drawThingOnQuadrant(thing: IThing, quadrant: QuadsKeepr.IQuadrant): void;
        drawThingOnContextSingle(
            context: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement,
            thing: IThing,
            left: number,
            top: number): void;
        drawThingOnContextMultiple(
            context: CanvasRenderingContext2D,
            canvases: IThingCanvases,
            thing: IThing,
            left: number,
            top: number
        ): void;
    }
}
