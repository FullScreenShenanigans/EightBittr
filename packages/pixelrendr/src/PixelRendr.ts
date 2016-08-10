/// <reference path="../typings/ChangeLinr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />

import {
    IClampedArraysContainer, IPixelRendrEncodeCallback, IFilter, IFilterAttributes, IFilterContainer, IGeneralSpriteGenerator, ILibrary, IPalette,
    IPixelRendr, IPixelRendrSettings, IRender, IRenderContainerListing, IRenderLibrary, ISpriteAttributes, ISpriteMultiple
} from "./IPixelRendr";
import { Render } from "./Render";
import { SpriteMultiple } from "./SpriteMultiple";

/**
 * Compresses images into text blobs in real time with fast cached lookups. 
 */
export class PixelRendr implements IPixelRendr {
    /**
     * The base container for storing sprite information.
     */
    private library: ILibrary;

    /**
     * A StringFilr interface on top of the base library.
     */
    private BaseFiler: StringFilr.IStringFilr<any>;

    /**
     * Applies processing Functions to turn raw Strings into partial sprites,
     * used during reset calls.
     */
    private ProcessorBase: ChangeLinr.IChangeLinr;

    /**
     * Takes partial sprites and repeats rows, then checks for dimension
     * flipping, used during on-demand retrievals.
     */
    private ProcessorDims: ChangeLinr.IChangeLinr;

    /**
     * Reverse of ProcessorBase: takes real images and compresses their data
     * into sprites.
     */
    private ProcessorEncode: ChangeLinr.IChangeLinr;

    /**
     * The default colors used for palettes in sprites.
     */
    private paletteDefault: IPalette;

    /**
     * The default digit size (how many characters per number).
     */
    private digitsizeDefault: number;

    /**
     * Utility RegExp to split Strings on every #digitsize characters.
     */
    private digitsplit: RegExp;

    /**
     * How much to "scale" each sprite by (repeat the pixels this much).
     */
    private scale: number;

    /**
     * String key to know whether to flip a processed sprite vertically,
     * based on supplied attributes.
     */
    private flipVert: string;

    /**
     * String key to know whether to flip a processed sprite horizontally,
     * based on supplied attributes.
     */
    private flipHoriz: string;

    /**
     * String key to obtain sprite width from supplied attributes.
     */
    private spriteWidth: string;

    /**
     * String key to obtain sprite height from supplied attributes.
     */
    private spriteHeight: string;

    /**
     * Filters for processing sprites.
     */
    private filters: IFilterContainer;

    /**
     * Generators used to generate Renders from sprite commands.
     */
    private commandGenerators: {
        [i: string]: IGeneralSpriteGenerator;
    };

    /**
     * A reference for window.Uint8ClampedArray, or replacements such as
     * Uint8Array if needed.
     */
    private Uint8ClampedArray: typeof Uint8ClampedArray;

    /**
     * Initializes a new instance of the PixelRendr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IPixelRendrSettings) {
        if (!settings) {
            throw new Error("No settings given to PixelRendr.");
        }
        if (!settings.paletteDefault) {
            throw new Error("No paletteDefault given to PixelRendr.");
        }

        this.setPalette(settings.paletteDefault);

        this.scale = settings.scale || 1;
        this.filters = settings.filters || {};
        this.flipVert = settings.flipVert || "flip-vert";
        this.flipHoriz = settings.flipHoriz || "flip-horiz";
        this.spriteWidth = settings.spriteWidth || "spriteWidth";
        this.spriteHeight = settings.spriteHeight || "spriteHeight";

        this.Uint8ClampedArray = settings.Uint8ClampedArray || (window as any).Uint8ClampedArray || (window as any).Uint8Array;

        // The first ChangeLinr does the raw processing of Strings to sprites
        // This is used to load & parse sprites into memory on startup
        this.ProcessorBase = new ChangeLinr.ChangeLinr({
            transforms: {
                spriteUnravel: this.spriteUnravel.bind(this),
                spriteApplyFilter: this.spriteApplyFilter.bind(this),
                spriteExpand: this.spriteExpand.bind(this),
                spriteGetArray: this.spriteGetArray.bind(this)
            },
            pipeline: ["spriteUnravel", "spriteApplyFilter", "spriteExpand", "spriteGetArray"]
        });

        // The second ChangeLinr does row repeating and flipping
        // This is done on demand when given a sprite's settings Object
        this.ProcessorDims = new ChangeLinr.ChangeLinr({
            transforms: {
                spriteRepeatRows: this.spriteRepeatRows.bind(this),
                spriteFlipDimensions: this.spriteFlipDimensions.bind(this)
            },
            pipeline: ["spriteRepeatRows", "spriteFlipDimensions"]
        });

        // As a utility, a processor is included to encode image data to sprites
        this.ProcessorEncode = new ChangeLinr.ChangeLinr({
            transforms: {
                imageGetData: this.imageGetData.bind(this),
                imageGetPixels: this.imageGetPixels.bind(this),
                imageMapPalette: this.imageMapPalette.bind(this),
                imageCombinePixels: this.imageCombinePixels.bind(this)
            },
            pipeline: ["imageGetData", "imageGetPixels", "imageMapPalette", "imageCombinePixels"],
            doUseCache: false
        });

        this.commandGenerators = {
            multiple: this.generateSpriteCommandMultipleFromRender.bind(this),
            same: this.generateSpriteCommandSameFromRender.bind(this),
            filter: this.generateSpriteCommandFilterFromRender.bind(this)
        };

        this.resetLibrary(settings.library || {});
    }

    /**
     * @returns The default colors used for palettes in sprites.
     */
    public getPaletteDefault(): IPalette {
        return this.paletteDefault;
    }

    /**
     * @returns The amount to expand sprites by when processing.
     */
    public getScale(): number {
        return this.scale;
    }

    /**
     * @returns The base container for storing sprite information.
     */
    public getBaseLibrary(): any {
        return this.BaseFiler.getLibrary();
    }

    /**
     * @returns The StringFilr interface on top of the base library.
     */
    public getBaseFiler(): StringFilr.IStringFilr<string[] | any> {
        return this.BaseFiler;
    }

    /**
     * @returns The processor that turns raw strings into partial sprites.
     */
    public getProcessorBase(): ChangeLinr.IChangeLinr {
        return this.ProcessorBase;
    }

    /**
     * @returns The processor that converts partial sprites and repeats rows.
     */
    public getProcessorDims(): ChangeLinr.IChangeLinr {
        return this.ProcessorDims;
    }

    /**
     * @returns The processor that takes real images and compresses their data 
     *          into sprite Strings.
     */
    public getProcessorEncode(): ChangeLinr.IChangeLinr {
        return this.ProcessorEncode;
    }

    /**
     * Retrieves the base sprite under the given key.
     * 
     * @param key   A key for a base sprite.
     * @returns The base sprite for the key. This will be a Uint8ClampedArray 
     *          or SpriteMultiple if a sprite is found, or the deepest matching 
     *          Object in the library if not.
     */
    public getSpriteBase(key: string): Uint8ClampedArray | ISpriteMultiple {
        return this.BaseFiler.get(key);
    }

    /**
     * Resets the nested library of sprite sources.
     * 
     * @param library   A new nested library of sprites.
     */
    public resetLibrary(library: any): void {
        this.library = {
            "raws": library || {}
        };

        this.library.sprites = this.libraryParse(this.library.raws);

        // The BaseFiler provides a searchable 'view' on the library of sprites
        this.BaseFiler = new StringFilr.StringFilr({
            library: this.library.sprites,
            normal: "normal" // to do: put this somewhere more official?
        });
    }

    /**
     * Resets an individual rendered sprite.
     * 
     * @param key   The key of the sprite to render.
     */
    public resetRender(key: string): void {
        const result: IRender | IRenderLibrary = this.BaseFiler.get(key);

        if (result === this.library.sprites) {
            throw new Error(`No render found for '${key}'.`);
        }

        (result as IRender).sprites = {};
    }

    /**
     * Replaces the current palette with a new one.
     * 
     * @param palette   The new palette to replace the current one.
     */
    public changePalette(palette: IPalette): void {
        this.setPalette(palette);

        for (const sprite in this.library.sprites) {
            if (!this.library.sprites.hasOwnProperty(sprite)) {
                continue;
            }
            this.BaseFiler.clearCached(sprite);
        }
    }

    /**
     * Standard render function. Given a key, this finds the raw information via
     * BaseFiler and processes it using ProcessorDims. Attributes are needed so
     * the ProcessorDims can stretch it on width and height.
     * 
     * @param key   The general key for the sprite.
     * @param attributes   Additional attributes for the sprite; width and height 
     *                     Numbers are required.
     * @returns A sprite for the given key and attributes.
     */
    public decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple {
        const result: IRender | IRenderLibrary = this.BaseFiler.get(key);

        if (result === this.library.sprites) {
            throw new Error(`No sprite found for '${key}'.`);
        }

        const render: IRender = result as IRender;

        // If the render doesn't have a listing for this key, create one
        if (!render.sprites.hasOwnProperty(key)) {
            this.generateRenderSprite(render, key, attributes);
        }

        const sprite: Uint8ClampedArray | ISpriteMultiple = render.sprites[key];

        if (!sprite || (sprite.constructor === this.Uint8ClampedArray && (sprite as Uint8ClampedArray).length === 0)) {
            throw new Error(`Could not generate sprite for '${key}'.`);
        }

        return sprite;
    }

    /**
     * Encodes an image into a sprite via ProcessorEncode.process.
     * 
     * @param image   An image to encode.
     * @param callback   An optional callback to call with image and the result.
     * @param args   Any additional arguments to pass to the callback.
     * @returns The resultant sprite.
     */
    public encode(image: HTMLImageElement, callback?: IPixelRendrEncodeCallback, ...args: any[]): string {
        const result: string = this.ProcessorEncode.process(image);

        if (callback) {
            callback(result, image, ...args);
        }

        return result;
    }

    /**
     * Fetches an image from a source and encodes it into a sprite via 
     * ProcessEncode.process. An HtmlImageElement is created and given an onload
     * of this.encode.
     * 
     * @param uri   The URI of an image to encode.
     * @param callback   A callback to call on the results.
     */
    public encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void {
        const image: HTMLImageElement = document.createElement("img");
        image.onload = this.encode.bind(this, image, callback);
        image.src = uri;
    }

    /**
     * Miscellaneous utility to generate a complete palette from raw image pixel
     * data. Unique [r,g,b,a] values are found using tree-based caching, and
     * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
     * pixel has a=0, it's completely transparent and goes before anything else
     * in the palette. Grayscale colors come next in order of light to dark, and
     * general colors come next sorted by decreasing r, g, and b in order.
     * 
     * @param data   The equivalent data from a context's getImageData(...).data.
     * @param forceZeroColor   Whether the palette should have a [0,0,0,0] color 
     *                         as the first element even if data does not contain 
     *                         it (by default, false).
     * @param giveArrays   Whether the resulting palettes should be converted to 
     *                     Arrays (by default, false).
     * @returns A working palette that may be used in sprite settings (Array[] if
     *          giveArrays is true).
     */
    public generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[] {
        const tree: any = {};
        const colorsGeneral: Uint8ClampedArray[] = [];
        const colorsGrayscale: Uint8ClampedArray[] = [];

        for (let i: number = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) {
                forceZeroColor = true;
                continue;
            }

            if (
                tree[data[i]]
                && tree[data[i]][data[i + 1]]
                && tree[data[i]][data[i + 1]][data[i + 2]]
                && tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                continue;
            }

            if (!tree[data[i]]) {
                tree[data[i]] = {};
            }

            if (!tree[data[i]][data[i + 1]]) {
                tree[data[i]][data[i + 1]] = {};
            }

            if (!tree[data[i]][data[i + 1]][data[i + 2]]) {
                tree[data[i]][data[i + 1]][data[i + 2]] = {};
            }

            if (!tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]]) {
                tree[data[i]][data[i + 1]][data[i + 2]][data[i + 3]] = true;

                if (data[i] === data[i + 1] && data[i + 1] === data[i + 2]) {
                    colorsGrayscale.push(data.subarray(i, i + 4));
                } else {
                    colorsGeneral.push(data.subarray(i, i + 4));
                }
            }
        }

        // It's safe to sort grayscale colors just on their first values, since
        // grayscale implies they're all the same.
        colorsGrayscale.sort(function (a: Uint8ClampedArray, b: Uint8ClampedArray): number {
            return a[0] - b[0];
        });

        // For regular colors, sort by the first color that's not equal, so in 
        // order red, green, blue, alpha.
        colorsGeneral.sort(function (a: Uint8ClampedArray, b: Uint8ClampedArray): number {
            for (let i: number = 0; i < 4; i += 1) {
                if (a[i] !== b[i]) {
                    return b[i] - a[i];
                }
            }
        });

        let output: Uint8ClampedArray[];

        if (forceZeroColor) {
            output = [new this.Uint8ClampedArray([0, 0, 0, 0])]
                .concat(colorsGrayscale)
                .concat(colorsGeneral);
        } else {
            output = colorsGrayscale.concat(colorsGeneral);
        }

        if (!giveArrays) {
            return output;
        }

        for (let i: number = 0; i < output.length; i += 1) {
            output[i] = Array.prototype.slice.call(output[i]);
        }

        return output;
    }

    /**
     * Copies a stretch of members from one Uint8ClampedArray or number[] to
     * another. This is a useful utility Function for code that may use this 
     * PixelRendr to draw its output sprites, such as PixelDrawr.
     * 
     * @param source   An Array-like source to copy from.
     * @param destination   An Array-like destination to copy to.
     * @param readloc   Where to start reading from in the source.
     * @param writeloc   Where to start writing to in the source.
     * @param writelength   How many members to copy over.
     * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
     * @see http://www.javascripture.com/Uint8ClampedArray
     */
    public memcpyU8(
        source: Uint8ClampedArray | number[],
        destination: Uint8ClampedArray | number[],
        readloc: number = 0,
        writeloc: number = 0,
        writelength: number = Math.min(source.length, destination.length)): void {
        // JIT compilation help
        let lwritelength: number = writelength + 0;
        let lwriteloc: number = writeloc + 0;
        let lreadloc: number = readloc + 0;

        while (lwritelength--) {
            destination[lwriteloc++] = source[lreadloc++];
        }
    }

    /**
     * Recursively travels through a library, turning all raw sprites and 
     * commands into Renders.
     * 
     * @param reference   The raw source structure to be parsed.
     * @param path   The path to the current place within the library.
     * @returns The parsed library Object.
     */
    private libraryParse(reference: any): IRenderLibrary {
        const setNew: IRenderLibrary = {};

        // For each child of the current layer:
        for (let i in reference) {
            if (!reference.hasOwnProperty(i)) {
                continue;
            }

            const source: any = reference[i];

            switch (source.constructor) {
                case String:
                    // Strings directly become IRenders
                    setNew[i] = new Render(source);
                    break;

                case Array:
                    // Arrays contain a String filter, a String[] source, and any
                    // number of following arguments
                    setNew[i] = new Render(source, source[1]);
                    break;

                default:
                    // If it's anything else, simply recurse
                    setNew[i] = this.libraryParse(source);
                    break;
            }

            // If a Render was created, mark setNew as a container
            if (setNew[i].constructor === Render) {
                (setNew[i] as IRender).containers.push({
                    container: setNew,
                    key: i
                });
            }
        }

        return setNew;
    }

    /**
     * Generates a sprite for a Render based on its internal source and an 
     * externally given String key and attributes Object. The sprite is stored
     * in the Render's sprites container under that key.
     * 
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite 
     *                     generation process.
     */
    private generateRenderSprite(render: Render, key: string, attributes: any): void {
        let sprite: Uint8ClampedArray | ISpriteMultiple;

        if (render.source.constructor === String) {
            sprite = this.generateSpriteSingleFromRender(render, key, attributes);
        } else {
            sprite = this.commandGenerators[render.source[0]](render, key, attributes);
        }

        render.sprites[key] = sprite;
    }

    /**
     * Generates the pixel data for a single sprite.
     * 
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation 
     *                     process.
     * @returns   The output sprite.
     */
    private generateSpriteSingleFromRender(render: Render, key: string, attributes: any): Uint8ClampedArray {
        const base: Uint8ClampedArray = this.ProcessorBase.process(render.source, key, render.filter);

        return this.ProcessorDims.process(base, key, attributes);
    }

    /**
     * Generates the pixel data for a SpriteMultiple to be generated by creating
     * a container in a new SpriteMultiple and filing it with processed single 
     * sprites.
     * 
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation 
     *                     process.
     * @returns The output sprite.
     */
    private generateSpriteCommandMultipleFromRender(render: Render, key: string, attributes: any): SpriteMultiple {
        const sources: any = render.source[2];
        const sprites: IClampedArraysContainer = {};
        const output: ISpriteMultiple = new SpriteMultiple(sprites, render);

        for (const i in sources) {
            if (sources.hasOwnProperty(i)) {
                const path: string = key + " " + i;
                const sprite: any = this.ProcessorBase.process(sources[i], path, render.filter);
                sprites[i] = this.ProcessorDims.process(sprite, path, attributes);
            }
        }

        return output;
    }

    /**
     * Generates the output of a "same" command. The referenced Render or
     * directory are found, assigned to the old Render's directory, and
     * this.decode is used to find the output.
     * 
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the
     *                              sprite generation process.
     * @returns The output sprite.
     */
    private generateSpriteCommandSameFromRender(render: Render, key: string, attributes: any): Uint8ClampedArray | SpriteMultiple {
        const replacement: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0);

        // The (now temporary) Render's containers are given the Render or directory
        // referenced by the source path
        this.replaceRenderInContainers(render, replacement);

        // BaseFiler will need to remember the new entry for the key,
        // so the cache is cleared and decode restarted
        this.BaseFiler.clearCached(key);
        return this.decode(key, attributes);
    }

    /**
     * Generates the output of a "filter" command. The referenced Render or
     * directory are found, converted into a filtered Render or directory, and
     * this.decode is used to find the output.
     * 
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation 
     *                     process.
     * @returns The output sprite.
     */
    private generateSpriteCommandFilterFromRender(
        render: Render,
        key: string,
        attributes: IFilterAttributes): Uint8ClampedArray | SpriteMultiple {
        const filter: IFilter = this.filters[render.source[2]];
        if (!filter) {
            throw new Error("Invalid filter provided: " + render.source[2]);
        }

        const found: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0);
        let filtered: Render | IRenderLibrary;

        // If found is a Render, create a new one as a filtered copy
        if (found.constructor === Render) {
            filtered = new Render((found as IRender).source, { filter });
            this.generateRenderSprite(filtered as IRender, key, attributes);
        } else {
            // Otherwise it's an IRenderLibrary; go through that recursively
            filtered = this.generateRendersFromFilter(found as IRenderLibrary, filter);
        }

        // The (now unused) render gives the filtered Render or directory to its containers
        this.replaceRenderInContainers(render, filtered);

        if (filtered.constructor === Render) {
            return (filtered as IRender).sprites[key];
        }

        this.BaseFiler.clearCached(key);
        return this.decode(key, attributes);
    }

    /**
     * Recursively generates a directory of Renders from a filter. This is
     * similar to this.libraryParse, though the filter is added and references
     * aren't.
     * 
     * @param directory   The current directory of Renders to create filtered versions 
     *                    of.
     * @param filter   The filter being applied.
     * @returns An output directory containing Renders with the filter.
     */
    private generateRendersFromFilter(directory: IRenderLibrary, filter: IFilter): IRenderLibrary {
        const output: IRenderLibrary = {};

        for (const i in directory) {
            if (!directory.hasOwnProperty(i)) {
                continue;
            }

            const child: Render | IRenderLibrary = directory[i];

            if (child instanceof Render) {
                output[i] = new Render(
                    (child as IRender).source,
                    {
                        "filter": filter
                    });
            } else {
                output[i] = this.generateRendersFromFilter(child, filter);
            }
        }

        return output;
    }

    /**
     * Switches all of a given Render's containers to point to a replacement instead.
     * 
     * @param render   A Render being replaced.
     * @param replacement   A replacement for render.
     */
    private replaceRenderInContainers(render: Render, replacement: Render | IRenderLibrary): void {
        for (let i: number = 0; i < render.containers.length; i += 1) {
            const listing: IRenderContainerListing = render.containers[i];

            listing.container[listing.key] = replacement;

            if (replacement.constructor === Render) {
                (replacement as IRender).containers.push(listing);
            }
        }
    }

    /**
     * Given a compressed raw sprite data string, this 'unravels' it. This is 
     * the first Function called in the base processor. It could output the
     * Uint8ClampedArray immediately if given the area - deliberately does not
     * to simplify sprite library storage.
     * 
     * @param colors   The raw sprite String, including commands like "p" and "x".
     * @returns A version of the sprite with fancy commands replaced by numbers.
     */
    private spriteUnravel(colors: string): string {
        let paletteReference: any = this.getPaletteReferenceStarting(this.paletteDefault);
        let digitsize: number = this.digitsizeDefault;
        let location: number = 0;
        let output: string = "";

        while (location < colors.length) {
            switch (colors[location]) {
                // A loop, ordered as 'x char times ,'
                case "x":
                    // Get the location of the ending comma
                    const commaLocation: number = colors.indexOf(",", ++location);
                    if (commaLocation === -1) {
                        throw new Error(`Unclosed repeat loop at ${location}`);
                    }

                    const current: string = this.makeDigit(paletteReference[colors.slice(location, location += digitsize)], this.digitsizeDefault);
                    let repetitions: number = parseInt(colors.slice(location, commaLocation));
                    while (repetitions--) {
                        output += current;
                    }
                    location = commaLocation + 1;
                    break;

                // A palette changer, in the form 'p[X,Y,Z...]' (or "p" for default)
                case "p":
                    // If the next character is a "[", customize.
                    if (colors[++location] === "[") {
                        const commaLocation: number = colors.indexOf("]");
                        if (commaLocation === -1) {
                            throw new Error(`Unclosed palette brackets at ${location}`);
                        }

                        // Isolate and split the new palette's numbers
                        paletteReference = this.getPaletteReference(colors.slice(location + 1, commaLocation).split(","));
                        location = commaLocation + 1;
                        digitsize = this.getDigitSizeFromObject(paletteReference);
                    } else {
                        // Otherwise go back to default
                        paletteReference = this.getPaletteReference(this.paletteDefault);
                        digitsize = this.digitsizeDefault;
                    }
                    break;

                // A typical number
                default:
                    output += this.makeDigit(paletteReference[colors.slice(location, location += digitsize)], this.digitsizeDefault);
                    break;
            }
        }

        return output;
    }

    /**
     * Repeats each number in the given string a number of times equal to the 
     * scale. This is the second Function called by the base processor.
     * 
     * @param colors   A series of sprite colors.
     * @returns   The same series, with each character repeated.
     */
    private spriteExpand(colors: string): string {
        let output: string = "";
        let i: number = 0;

        // For each number,
        while (i < colors.length) {
            const current: string = colors.slice(i, i += this.digitsizeDefault);

            // Put it into output as many times as needed
            for (let j: number = 0; j < this.scale; j += 1) {
                output += current;
            }
        }

        return output;
    }

    /**
     * Used during post-processing before spriteGetArray to filter colors. This
     * is the third Function used by the base processor, but it just returns the
     * original sprite if no filter should be applied from attributes.
     * Filters are applied here because the sprite is just the numbers repeated,
     * so it's easy to loop through and replace them.
     * 
     * @param colors   A series of color characters.
     * @param key   The unique key identifying this chain of transforms.
     * @param attributes   Attributes describing the filter to use.
     * @returns The original series of color characters, filtered.
     */
    private spriteApplyFilter(colors: string, key: string, attributes: IFilterAttributes): string {
        // If there isn't a filter (as is the norm), just return the sprite
        if (!attributes || !attributes.filter) {
            return colors;
        }

        const filter: IFilter = attributes.filter;
        const filterName: string = filter[0];

        if (!filterName) {
            return colors;
        }

        switch (filterName) {
            // Palette filters switch all instances of one color with another
            case "palette":
                // Split the colors on on each digit
                // ("...1234..." => [..., "12", "34", ...]
                const split: string[] = colors.match(this.digitsplit);

                // For each color filter to be applied, replace it
                for (const i in filter[1]) {
                    if (filter[1].hasOwnProperty(i)) {
                        this.arrayReplace(split, i, filter[1][i]);
                    }
                }

                return split.join("");

            default:
                throw new Error("Unknown filter: '" + filterName + "'.");
        }
    }

    /**
     * Converts an unraveled String of sprite numbers to the equivalent RGBA
     * Uint8ClampedArray. Each colors number will be represented by four numbers
     * in the output. This is the fourth Function called in the base processor.
     * 
     * @param colors   A series of color characters.
     * @returns A series of pixels equivalent to the colors.
     */
    private spriteGetArray(colors: string): Uint8ClampedArray {
        const numColors: number = colors.length / this.digitsizeDefault;
        const split: string[] = colors.match(this.digitsplit);
        const output: Uint8ClampedArray = new this.Uint8ClampedArray(numColors * 4);

        let i: number = 0;
        let j: number = 0;

        // For each color...
        while (i < numColors) {
            // Grab its RGBA ints
            const reference: number[] = this.paletteDefault[Number(split[i])];

            // Place each in output
            for (let k: number = 0; k < 4; k += 1) {
                output[j + k] = reference[k];
            }

            i += 1;
            j += 4;
        }

        return output;
    }

    /**
     * Repeats each row of a sprite based on the container attributes to create
     * the actual sprite (before now, the sprite was 1 / scale as high as it
     * should have been). This is the first Function called in the dimensions
     * processor.
     * 
     * @param sprite   A series of sprite pixels.
     * @param key   The unique key identifying this chain of transforms.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, with rows repeated.
     */
    private spriteRepeatRows(sprite: Uint8ClampedArray, key: string, attributes: ISpriteAttributes): Uint8ClampedArray {
        const parsed: Uint8ClampedArray = new this.Uint8ClampedArray(sprite.length * this.scale);
        const rowsize: number = attributes[this.spriteWidth] as number * 4;
        const height: number = attributes[this.spriteHeight] as number / this.scale;
        let readloc: number = 0;
        let writeloc: number = 0;

        // For each row:
        for (let i: number = 0; i < height; i += 1) {
            // Add it to parsed x scale
            for (let j: number = 0; j < this.scale; j += 1) {
                this.memcpyU8(sprite, parsed, readloc, writeloc, rowsize);
                writeloc += rowsize;
            }

            readloc += rowsize;
        }

        return parsed;
    }

    /**
     * Optionally flips a sprite based on the flipVert and flipHoriz keys. This
     * is the second Function in the dimensions processor and the last step
     * before a sprite is deemed usable.
     * 
     * @param sprite   A series of sprite pixels.
     * @param key   The unique key identifying this chain of transforms.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, with dimensions flipped.
     */
    private spriteFlipDimensions(sprite: Uint8ClampedArray, key: string, attributes: ISpriteAttributes): Uint8ClampedArray {
        if (key.indexOf(this.flipHoriz) !== -1) {
            if (key.indexOf(this.flipVert) !== -1) {
                return this.flipSpriteArrayBoth(sprite);
            } else {
                return this.flipSpriteArrayHoriz(sprite, attributes);
            }
        } else if (key.indexOf(this.flipVert) !== -1) {
            return this.flipSpriteArrayVert(sprite, attributes);
        }

        return sprite;
    }

    /**
     * Flips a sprite horizontally by reversing the pixels within each row. Rows
     * are computing using the spriteWidth in attributes.
     * 
     * @param sprite   A series of sprite pixels.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, flipped horizontally.
     */
    private flipSpriteArrayHoriz(sprite: Uint8ClampedArray, attributes: ISpriteAttributes): Uint8ClampedArray {
        const length: number = sprite.length + 0;
        const width: number = attributes[this.spriteWidth] as number + 0;
        const spriteFlipped: Uint8ClampedArray = new this.Uint8ClampedArray(length);
        const rowsize: number = width * 4;

        // For each row:
        for (let i: number = 0; i < length; i += rowsize) {
            let newloc: number = i;
            let oldloc: number = i + rowsize - 4;

            // For each pixel:
            for (let j: number = 0; j < rowsize; j += 4) {
                // Copy it over
                for (let k: number = 0; k < 4; k += 1) {
                    spriteFlipped[newloc + k] = sprite[oldloc + k];
                }

                newloc += 4;
                oldloc -= 4;
            }
        }

        return spriteFlipped;
    }

    /**
     * Flips a sprite vertically by reversing the order of the rows. Rows are
     * computing using the spriteWidth in attributes.
     * 
     * @param sprite   A series of sprite pixels.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, flipped vertically.
     */
    private flipSpriteArrayVert(sprite: Uint8ClampedArray, attributes: ISpriteAttributes): Uint8ClampedArray {
        const length: number = sprite.length + 0;
        const width: number = attributes[this.spriteWidth] as number + 0;
        const spriteFlipped: Uint8ClampedArray = new this.Uint8ClampedArray(length);
        const rowsize: number = width * 4;
        let oldIndex: number = length - rowsize;
        let newIndex: number = 0;

        // For each row
        while (newIndex < length) {
            // For each pixel in the rows
            for (let i: number = 0; i < rowsize; i += 4) {
                // For each rgba value
                for (let j: number = 0; j < 4; j += 1) {
                    spriteFlipped[newIndex + i + j] = sprite[oldIndex + i + j];
                }
            }

            newIndex += rowsize;
            oldIndex -= rowsize;
        }

        return spriteFlipped;
    }

    /**
     * Flips a sprite horizontally and vertically by reversing the order of the
     * pixels. This doesn't actually need attributes.
     * 
     * @param sprite   A series of sprite pixels.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, flipped horizontally and vertically.
     */
    private flipSpriteArrayBoth(sprite: Uint8ClampedArray): Uint8ClampedArray {
        const length: number = sprite.length + 0;
        const spriteFlipped: Uint8ClampedArray = new this.Uint8ClampedArray(length);
        let oldIndex: number = length - 4;
        let newIndex: number = 0;

        while (newIndex < length) {
            for (let i: number = 0; i < 4; i += 1) {
                spriteFlipped[newIndex + i] = sprite[oldIndex + i];
            }

            newIndex += 4;
            oldIndex -= 4;
        }

        return spriteFlipped;
    }

    /**
     * Retrives the raw pixel data from an image element. It is copied onto a 
     * canvas, which as its context return the .getImageDate().data results.
     * This is the first Fiunction used in the encoding processor.
     * 
     * @param image   An image whose data is to be retrieved.
     */
    private imageGetData(image: HTMLImageElement): Uint8ClampedArray {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        const context: CanvasRenderingContext2D = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
    }

    /**
     * Determines which pixels occur in the data and at what frequency. This is
     * the second Function used in the encoding processor.
     * 
     * @param data   The raw pixel data obtained from the imageData of a canvas.
     * @returns [pixels, occurences], where pixels is an array of [rgba] values 
     *          and occurences is an Object mapping occurence frequencies of 
     *          palette colors in pisels.
     */
    private imageGetPixels(data: Uint8ClampedArray): [number[], any] {
        const pixels: number[] = new Array(data.length / 4);
        const occurences: any = {};

        let i: number;
        let j: number;

        while (i < data.length) {
            const pixel: number = this.getClosestInPalette(this.paletteDefault, data.subarray(i, i + 4));
            pixels[j] = pixel;

            if (occurences.hasOwnProperty(pixel)) {
                occurences[pixel] += 1;
            } else {
                occurences[pixel] = 1;
            }

            i += 4;
            j += 1;
        }

        return [pixels, occurences];
    }

    /**
     * Concretely defines the palette to be used for a new sprite. This is the
     * third Function used in the encoding processor, and creates a technically
     * usable (but uncompressed) sprite with information to compress it.
     * 
     * @param information   [pixels, occurences], a result directly from imageGetPixels.    
     * @returns [palette, numbers, digitsize], where palette is a String[] of palette 
     *          numbers, numbers is the actual sprite data, and digitsize is the sprite's
     *          digit size.
     */
    private imageMapPalette(information: [number[], any]): [string[], number[], number] {
        const pixels: number[] = information[0];
        const occurences: any = information[1];
        const palette: string[] = Object.keys(occurences);
        const digitsize: number = this.getDigitSizeFromArray(palette);
        const paletteIndices: any = this.getValueIndices(palette);
        const numbers: number[] = pixels.map(
            (pixel: number): number => paletteIndices[pixel]);

        return [palette, numbers, digitsize];
    }

    /**
     * Compresses a nearly complete sprite from imageMapPalette into a 
     * compressed, storage-ready String. This is the last Function in the 
     * encoding processor.
     * 
     * @param information   [palette, numbers, digitsize], a result directly from 
     *                      imageMapPalette.
     * @returns The pixels from information, combined.
     */
    private imageCombinePixels(information: [string[], number[], number]): string {
        const palette: string[] = information[0];
        const numbers: number[] = information[1];
        const digitsize: number = information[2];
        const threshold: number = Math.max(3, Math.round(4 / digitsize));
        let output: string = "p[" + palette.map(this.makeSizedDigit.bind(this, digitsize)).join(",") + "]";
        let i: number = 0;

        while (i < numbers.length) {
            let j: number = i + 1;
            let current: number = numbers[i];
            const digit: string = this.makeDigit(current, digitsize);

            while (current === numbers[j]) {
                j += 1;
            }

            if (j - i > threshold) {
                output += "x" + digit + String(j - i) + ",";
                i = j;
            } else {
                do {
                    output += digit;
                    i += 1;
                }
                while (i < j);
            }
        }

        return output;
    }

    /**
     * Sets the palette and digitsize Default/digitsplit based off that palette.
     * 
     * @param palette   The palette being assigned to paletteDefault.
     */
    private setPalette(palette: IPalette): void {
        this.paletteDefault = palette;
        this.digitsizeDefault = this.getDigitSizeFromArray(this.paletteDefault);
        this.digitsplit = new RegExp(`.{1,${this.digitsizeDefault}}`, "g");
    }

    /**
     * Determines how many digits will be required to represent a member of
     * the palette.
     * 
     * @param palette   A palette of colors.
     * @returns The equivalent digitsize for the palette.
     */
    private getDigitSizeFromArray(palette: any[]): number {
        let digitsize: number = 0;

        for (let i = palette.length; i >= 1; i /= 10) {
            digitsize += 1;
        }

        return digitsize;
    }

    /**
     * Determines how many digits will be required to represent a member of
     * the palette.
     * 
     * @param palette   A palette of colors.
     * @returns The equivalent digitsize for the palette.
     */
    private getDigitSizeFromObject(palette: any): number {
        return this.getDigitSizeFromArray(Object.keys(palette));
    }

    /**
     * Generates an actual palette Object for a given palette, using a digitsize
     * calculated from the palette.
     * 
     * @param palette   A palette of colors
     * @returns The actual palette Object for the given palette, with an index 
     *          for every palette member.
     */
    private getPaletteReference(palette: any[]): any {
        const output: any = {};
        let digitsize: number = this.getDigitSizeFromArray(palette);

        for (let i: number = 0; i < palette.length; i += 1) {
            output[this.makeDigit(i, digitsize)] = this.makeDigit(palette[i], digitsize);
        }

        return output;
    }

    /**
     * Generates an actual palette Object for a given palette, using the default
     * digitsize.
     * 
     * @param palette   A palette of colors.
     * @returns The actual palette Object for the given palette, with an index 
     *          for every palette member.
     */
    private getPaletteReferenceStarting(palette: IPalette): any {
        const output: any = {};

        for (let i: number = 0; i < palette.length; i += 1) {
            const digit: string = this.makeDigit(i, this.digitsizeDefault);
            output[digit] = digit;
        }

        return output;
    }

    /**
     * Finds which rgba value in a palette is closest to a given value. This is
     * useful for determining which color in a pre-existing palette matches up
     * with a raw image's pixel. This is determined by which palette color has
     * the lowest total difference in integer values between r, g, b, and a.
     * 
     * @param palette   The palette of pre-existing colors.
     * @param rgba   The RGBA values being assigned, as Numbers in [0, 255].    
     * @returns The closest matching color index.
     */
    private getClosestInPalette(palette: IPalette, rgba: number[] | Uint8ClampedArray): number {
        let bestDifference: number = Infinity;
        let difference: number;
        let bestIndex: number;

        for (let i: number = palette.length - 1; i >= 0; i -= 1) {
            difference = this.arrayDifference(palette[i], rgba);
            if (difference < bestDifference) {
                bestDifference = difference;
                bestIndex = i;
            }
        }

        return bestIndex;
    }

    /**
     * Creates a new String equivalent to an old String repeated any number of
     * times. If times is 0, a blank String is returned.
     * 
     * @param string   The characters to repeat.
     * @param times   How many times to repeat (by default, 1).
     * @returns The original string, repeated.
     */
    private stringOf(text: string, times?: number): string {
        return (times === 0) ? "" : new Array(1 + (times || 1)).join(text);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     * 
     * @param number   The original Number being padded.
     * @param size   How many digits the output must contain.
     * @param prefix   A prefix to repeat for padding (by default, "0").
     * @returns A Stringified digit of the given length.
     * @example makeDigit(7, 3); // '007'
     * @example makeDigit(7, 3, 1); // '117'
     */
    private makeDigit(num: number | string, size: number, prefix: string = "0"): string {
        return this.stringOf(prefix, Math.max(0, size - String(num).length)) + num;
    }

    /**
     * Curry wrapper around makeDigit that reverses size and number argument 
     * order. Useful for binding makeDigit.
     * 
     * @param number   The original Number being padded.
     * @param size   How many digits the output must contain.
     * @returns A stringified digit of the given length.
     */
    private makeSizedDigit(size: number, digit: number): string {
        return this.makeDigit(digit, size, "0");
    }

    /**
     * Replaces all instances of an element in an Array.
     * 
     * @param array   The original elements.
     * @param removed   The element to remove.
     * @param inserted   The element to insert.
     * @returns The original Array, with the element replaced.
     */
    private arrayReplace(array: any[], removed: any, inserted: any): any[] {
        for (let i: number = 0; i < array.length; i += 1) {
            if (array[i] === removed) {
                array[i] = inserted;
            }
        }

        return array;
    }

    /**
     * Computes the sum of the differences of elements between two Arrays of
     * equal length.
     * 
     * @param a   An Array of Numbers.
     * @param b   An Array of Numbers.
     * @returns The sum of differences between a and b.
     */
    private arrayDifference(a: number[] | Uint8ClampedArray, b: number[] | Uint8ClampedArray): number {
        let sum: number = 0;

        for (let i: number = a.length - 1; i >= 0; i -= 1) {
            sum += Math.abs(a[i] - b[i]) | 0;
        }

        return sum;
    }

    /**
     * Converts an Array to an Object mapping values to indices.
     * 
     * @param array   An Array to convert.
     * @returns An Object with an index equal to each element of the Array.
     */
    private getValueIndices(array: any[]): any {
        const output: any = {};

        for (let i: number = 0; i < array.length; i += 1) {
            output[array[i]] = i;
        }

        return output;
    }

    /**
     * Follows a path inside an Object recursively, based on a given path.
     * 
     * @param object   An Object to delve within.
     * @param path   The ordered names of attributes to descend into.
     * @param index   The starting index in path.
     * @returns A found element within object.
     */
    private followPath(object: any, path: string[], index: number): any {
        if (index < path.length && object.hasOwnProperty(path[index])) {
            return this.followPath(object[path[index]], path, index + 1);
        }

        return object;
    }
}
