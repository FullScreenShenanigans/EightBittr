declare module PixelRendr {
    export interface IPixelRendrEncodeCallback {
        (result: string, image: HTMLImageElement, source: any): any;
    }

    export interface ISpriteMultiple {
        direction: string;
        multiple: boolean;
        sprites: any;
        processed: boolean;
        topheight: number;
        rightwidth: number;
        bottomheight: number;
        leftwidth: number;
        middleStretch: boolean;
    }

    export interface IPixelRendrSettings {
        /**
         * The palette of colors to use for sprites. This should be a number[][]
         * of RGBA values.
         */
        paletteDefault: number[][];

        /**
         * A nested library of sprites to process.
         */
        library?: any;

        /**
         * Filters that may be used by sprites in the library.
         */
        filters?: any;

        /**
         * An amount to expand sprites by when processing (by default, 1 for not at
         * all).
         */
        scale?: number;

        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * vertically (by default, "flip-vert").
         */
        flipVert?: string;

        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * horizontally (by default, "flip-vert").
         */
        flipHoriz?: string;

        /**
         * What key in attributions should contain sprite widths (by default, 
         * "spriteWidth").
         */
        spriteWidth?: string;

        /**
         *  What key in attributions should contain sprite heights (by default, 
         * "spriteHeight").
         */
        spriteHeight?: string;

        /**
         * A replacement for window.Uint8ClampedArray, if desired.
         */
        Uint8ClampedArray?: any;
    }

    export interface IPixelRendr {
        getBaseLibrary(): any;
        getBaseFiler(): StringFilr.IStringFilr;
        getProcessorBase(): ChangeLinr.IChangeLinr;
        getProcessorDims(): ChangeLinr.IChangeLinr;
        getProcessorEncode(): ChangeLinr.IChangeLinr;
        getSpriteBase(key: string): void;
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        encode(image: HTMLImageElement, callback: IPixelRendrEncodeCallback, source: any): string;
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        memcpyU8(
            source: Uint8ClampedArray | number[],
            destination: Uint8ClampedArray | number[],
            readloc?: number,
            writeloc?: number,
            writelength?: number);
    }
}

/**
 * A typed array of 8-bit unsigned integer values. The contents are initialized 
 * to 0. If the requested number of bytes could not be allocated an exception is
 *  raised.
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
      * @param index The index at which to get the element of the array.
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

declare var Uint8ClampedArray: {
    prototype: Uint8ClampedArray;
    new (length: number): Uint8ClampedArray;
    new (array: Uint8ClampedArray): Uint8ClampedArray;
    new (array: number[]): Uint8ClampedArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
    BYTES_PER_ELEMENT: number;
}
