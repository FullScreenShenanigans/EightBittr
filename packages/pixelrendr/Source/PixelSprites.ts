/// <reference path="definitions.d.ts" />

// Compatability shim for ES3
interface Uint8ClampedArray extends ArrayBufferView {
    BYTES_PER_ELEMENT: number;
    length: number;
    [index: number]: number;
    get(index: number): number;
    set(index: number, value: number): void;
    set(array: Uint8Array, offset?: number): void;
    set(array: number[], offset?: number): void;
    subarray(begin: number, end?: number): Uint8Array;
}
declare var Uint8ClampedArray: {
    prototype: Uint8ClampedArray;
    new (length: number): Uint8ClampedArray;
    new (array: Uint8Array): Uint8ClampedArray;
    new (array: number[]): Uint8ClampedArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
    BYTES_PER_ELEMENT: number;
}

interface IPixelSprite {
    processed: boolean;
    multiple: boolean;
    process(processorBase: ChangeLinr, processorDims: ChangeLinr, key: string, attributes: any): IPixelSprite;
}

interface IPixelSpriteInformation {
    top?: Uint8ClampedArray;
    right?: Uint8ClampedArray;
    bottom?: Uint8ClampedArray;
    left?: Uint8ClampedArray;
    middle?: Uint8ClampedArray;
}

interface IPixelSpriteInformationRaw {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    middle?: string;
    topheight?: number;
    rightwidth?: number;
    bottomheight?: number;
    leftwidth?: number;
    middleStretch?: boolean;
}

class PixelSpriteSingle implements IPixelSprite {
    processed: boolean = false;
    multiple: boolean = false;
    sprite: Uint8ClampedArray;
    spriteRaw: string;

    constructor(path: string, source: any) {
        this.spriteRaw = source;
    }
    
    /**
     * @param {ChangeLinr} processorBase
     * @param {ChangeLinr} processorDims
     * @param {String} path   The path to the sprites in the library.
     * @param {Array} command   The instructions from the library, in the form 
     *                          ["multiple", "{direction}", {Information}].
     */
    process(processorBase: ChangeLinr, processorDims: ChangeLinr, key: string, attributes: any = {}): PixelSpriteSingle {
        this.sprite = processorBase.process(this.sprite, key, attributes);
        this.sprite = processorDims.process(this.sprite, key, attributes);
        this.processed = true;

        return this;
    }
}

class PixelSpriteMultiple implements IPixelSprite {
    processed: boolean = false;
    multiple: boolean = true;
    middleStretch: boolean = false;

    direction: string;

    topheight: number;
    rightwidth: number;
    bottomheight: number;
    leftwidth: number;

    sprites: IPixelSpriteInformation;
    spritesRaw: IPixelSpriteInformationRaw;
    
    /**
     * @param {String} path   The path to the sprites in the library.
     * @param {Array} command   The instructions from the library, in the form 
     *                          ["multiple", "{direction}", {Information}].
     */
    constructor(path: string, source: any[]) {
        this.direction = source[1];
        this.spritesRaw = source[2];

        this.topheight = this.spritesRaw.topheight | 0;
        this.rightwidth = this.spritesRaw.rightwidth | 0;
        this.bottomheight = this.spritesRaw.bottomheight | 0;
        this.leftwidth = this.spritesRaw.leftwidth | 0;

        if (this.spritesRaw.middleStretch) {
            this.middleStretch = true;
        }
    }
    
    /**
     * Processes each of the components in a SpriteMultiple. These are all 
     * individually processed using the attributes by the dimensions processor.
     * Each sub-sprite will be processed as if it were in a sub-Object referred
     * to by the path (so if path is "foo bar", "foo bar middle" will be the
     * middle sprite's key).
     * 
     * @param {ChangeLinr} processor   A processor to expand the pixel data
     *                                 for rows and columns based on attributes.
     * @param {String} key   The key to cache sprite data underneath in the
     *                       processor. This will have the sprite keys added as
     *                       suffixes for each sub-sprite.
     * @param {Object} attributes   Additional attributes required to process
     *                              the sprite (namely size).
     */
    process(processorBase: ChangeLinr, processorDims: ChangeLinr, key: string, attributes: any = {}): PixelSpriteMultiple {
        var keyInner: string,
            i: string;

        for (i in this.sprites) {
            keyInner = key + " " + i;
            this.sprites[i] = processorBase.process(this.sprites[i], keyInner, attributes);
            this.sprites[i] = processorDims.process(this.sprites[i], keyInner, attributes);
        }

        this.processed = true;

        return this;
    }
}

class PixelSpritePlaceholder implements IPixelSprite {
    processed: boolean = false;
    multiple: boolean;
    path: string;
    source: any;
    PixelRender: PixelRendr;

    constructor(path: string, source: any, PixelRender: PixelRendr) {
        this.path = path;
        this.source = source;
        this.PixelRender = PixelRender;
    }

    process(processorBase: ChangeLinr, processorDims: ChangeLinr, key: string, attributes: any = {}): IPixelSprite {
        var output: IPixelSprite,
            referenced: any;

        switch (this.source[0]) {
            // Same: just returns a reference to the target
            // ["same", ["path", "to", "target"]]
            case "same":
                output = this.processSame(processorBase, processorDims, key, attributes);
                break;
            case "multiple":
                output = new PixelSpriteMultiple(this.path, this.source);
                break;
            case "filter":

                break;
            default:
                throw new Error("Unknown command for PixelSpritePlaceholder: " + this.source[0]);
        }

        if (!output.processed) {
            output.process(processorBase, processorDims, key, attributes);
        }

        return output;
    }

    processSame(processorBase: ChangeLinr, processorDims: ChangeLinr, key: string, attributes: any = {}): IPixelSprite {
        var referenced: any = this.followPath(this.PixelRender.getBaseLibrary().raws, this.source[1], 0);

        switch (referenced.constructor) {
            case String:
                return new PixelSpriteSingle(this.path, referenced);
            case Array:

        }
    }

    followPath(container: any, path: string[], index: number): any {
        if (index < path.length && container.hasOwnProperty(path[index])) {
            return this.followPath(container[path[index]], path, index + 1);
        }

        return container;
    }
}
