declare module PixelRendr {
    export interface ILibrary {
        raws: any;
        sprites?: IRenderLibrary;
    }

    export interface IRender {
        source: string | any[];
        sprites: IRenderSprites;
        filter: IFilterAttributes;
        containers: IRenderContainerListing[];
    }

    export interface IRenderLibrary {
        [i: string]: IRenderLibrary | IRender;
    }

    export interface IRenderSprites {
        [i: string]: Uint8ClampedArray | ISpriteMultiple;
    }

    export interface IRenderContainerListing {
        container: IRenderLibrary;
        key: string;
    }

    export interface IGeneralSpriteGenerator {
        (render: IRender, key: string, attributes: ISpriteAttributes): Uint8ClampedArray | ISpriteMultiple;
    }

    export interface IPixelRendrEncodeCallback {
        (result: string, image: HTMLImageElement, source: any): any;
    }

    export interface IClampedArraysContainer {
        [i: string]: Uint8ClampedArray;
    }

    export interface ISpriteAttributes {
        filter?: IFilter;
        [i: string]: number | IFilter;
    }

    export interface IFilter {
        0: string;
        1: {
            [i: string]: string;
        }
    }

    export interface IFilterContainer {
        [i: string]: IFilter;
    }

    export interface IFilterAttributes {
        filter: IFilter;
    }
    
    export interface ISpriteMultiple {
        sprites: IClampedArraysContainer;
        direction: string;
        topheight: number;
        rightwidth: number;
        bottomheight: number;
        leftwidth: number;
        middleStretch: boolean;
    }

    /**
     * Settings to initialize a new IPixelRendr.
     */
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
        filters?: IFilterContainer;

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
        Uint8ClampedArray?: typeof Uint8ClampedArray;
    }

    /**
     * A moderately unusual graphics module designed to compress images as
     * compressed text blobs and store the text blobs in a StringFilr. These tasks 
     * are performed and cached quickly enough for use in real-time environments, 
     * such as real-time video games.
     */
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