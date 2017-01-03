import { ChangeLinr } from "changelinr/lib/ChangeLinr";
import { IChangeLinr } from "changelinr/lib/IChangeLinr";
import { IStringFilr } from "stringfilr/lib/IStringFilr";
import { StringFilr } from "stringfilr/lib/StringFilr";

import {
    IFilter, IFilterAttributes, IFilterContainer,
    IGeneralSpriteGenerator, ILibrary, ILibraryRaws, IPalette, IPixelRendr,
    IPixelRendrSettings, IRender, IRenderContainerListing, IRenderLibrary,
    ISpriteAttributes, ISpriteSingles
} from "./IPixelRendr";
import { Library } from "./Library";
import { Render } from "./Render";
import { SpriteMultiple } from "./SpriteMultiple";
import { SpriteSingle } from "./SpriteSingle";

/**
 * Compresses images into text blobs in real time with fast cached lookups. 
 */
export class PixelRendr implements IPixelRendr {
    /**
     * The base container for storing sprite information.
     */
    private library: Library;

    /**
     * A StringFilr interface on top of the base library.
     */
    private baseFiler: IStringFilr<any>;

    /**
     * Applies processing Functions to turn raw Strings into partial sprites,
     * used during reset calls.
     */
    private processorBase: IChangeLinr;

    /**
     * Takes partial sprites and repeats rows, then checks for dimension
     * flipping, used during on-demand retrievals.
     */
    private processorDims: IChangeLinr;

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
    public constructor(settings: IPixelRendrSettings = {}) {
        this.setPalette(settings.paletteDefault || [[0, 0, 0, 0]]);

        this.scale = settings.scale || 1;
        this.filters = settings.filters || {};
        this.flipVert = settings.flipVert || "flip-vert";
        this.flipHoriz = settings.flipHoriz || "flip-horiz";
        this.spriteWidth = settings.spriteWidth || "spriteWidth";
        this.spriteHeight = settings.spriteHeight || "spriteHeight";

        this.Uint8ClampedArray = (window as any).Uint8ClampedArray || (window as any).Uint8Array;

        // The first ChangeLinr does the raw processing of Strings to sprites
        // This is used to load & parse sprites into memory on startup
        this.processorBase = new ChangeLinr({
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
        this.processorDims = new ChangeLinr({
            transforms: {
                spriteRepeatRows: this.spriteRepeatRows.bind(this),
                spriteFlipDimensions: this.spriteFlipDimensions.bind(this)
            },
            pipeline: ["spriteRepeatRows", "spriteFlipDimensions"]
        });

        this.commandGenerators = {
            multiple: this.generateSpriteCommandMultipleFromRender.bind(this),
            same: this.generateSpriteCommandSameFromRender.bind(this),
            filter: this.generateSpriteCommandFilterFromRender.bind(this)
        };

        this.resetLibrary(settings.library);
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
    public getLibrary(): ILibrary {
        return this.library;
    }

    /**
     * @returns The filed library of sprite information.
     */
    public getBaseLibrary(): any {
        return this.baseFiler.getLibrary();
    }

    /**
     * @returns The StringFilr interface on top of the base library.
     */
    public getBaseFiler(): IStringFilr<string[] | any> {
        return this.baseFiler;
    }

    /**
     * @returns The processor that turns raw strings into partial sprites.
     */
    public getProcessorBase(): IChangeLinr {
        return this.processorBase;
    }

    /**
     * @returns The processor that converts partial sprites and repeats rows.
     */
    public getProcessorDims(): IChangeLinr {
        return this.processorDims;
    }

    /**
     * Retrieves the base sprite under the given key.
     * 
     * @param key   A key for a base sprite.
     * @returns The base sprite for the key. This will be a Uint8ClampedArray 
     *          or SpriteMultiple if a sprite is found, or the deepest matching 
     *          Object in the library if not.
     */
    public getSpriteBase(key: string): Uint8ClampedArray | SpriteMultiple {
        return this.baseFiler.get(key);
    }

    /**
     * Resets the nested library of sprite sources.
     * 
     * @param library   A new nested library of sprites.
     */
    public resetLibrary(raws: ILibraryRaws = {}): void {
        this.library = new Library(raws);

        // The BaseFiler provides a searchable 'view' on the library of sprites
        this.baseFiler = new StringFilr({
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
        const result: IRender | IRenderLibrary = this.baseFiler.get(key);

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

        for (const sprite in this.library.sprites!) {
            this.baseFiler.clearCached(sprite);
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
    public decode(key: string, attributes: any): SpriteSingle | SpriteMultiple {
        const result: Render | IRenderLibrary = this.baseFiler.get(key);
        if (!(result instanceof Render)) {
            throw new Error(`No sprite found for '${key}'.`);
        }

        // If the render doesn't have a listing for this key, create one
        if (!(key in result.sprites)) {
            this.generateRenderSprite(result, key, attributes);
        }

        const sprite: SpriteSingle | SpriteMultiple = result.sprites[key];
        if (!sprite) {
            throw new Error(`Could not generate sprite for '${key}'.`);
        }

        return sprite;
    }

    /**
     * Copies a slice from one Uint8ClampedArray or number[] to another.
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
     * @param raws   The raw source structure to be parsed.
     * @param path   The path to the current place within the library.
     * @returns The parsed library Object.
     */
    private libraryParse(raws: ILibraryRaws): IRenderLibrary {
        const setNew: IRenderLibrary = {};

        // For each child of the current layer:
        for (const i in raws) {
            const source: any = raws[i];

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
        render.sprites[key] = typeof render.source === "string"
            ? this.generateSpriteSingleFromRender(render, key, attributes)
            : this.commandGenerators[render.source[0]](render, key, attributes);
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
    private generateSpriteSingleFromRender(render: Render, key: string, attributes: any): SpriteSingle {
        const base: Uint8ClampedArray = this.processorBase.process(render.source, key, render.filter);

        return new SpriteSingle(this.processorDims.process(base, key, attributes));
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
        const sprites: ISpriteSingles = {};

        for (const i in sources) {
            const path: string = key + " " + i;
            const sprite: any = this.processorBase.process(sources[i], path, render.filter);
            sprites[i] = new SpriteSingle(this.processorDims.process(sprite, path, attributes));
        }

        return new SpriteMultiple(sprites, render.source);
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
    private generateSpriteCommandSameFromRender(render: Render, key: string, attributes: any): SpriteSingle | SpriteMultiple {
        const replacement: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0);

        // The (now temporary) Render's containers are given the Render or directory
        // referenced by the source path
        this.replaceRenderInContainers(render, replacement);

        // BaseFiler will need to remember the new entry for the key,
        // so the cache is cleared and decode restarted
        this.baseFiler.clearCached(key);
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
        attributes: IFilterAttributes): SpriteSingle | SpriteMultiple {
        const filter: IFilter = this.filters[render.source[2]];
        if (!filter) {
            throw new Error(`Invalid filter provided: '${render.source[2]}'.`);
        }

        const found: Render | IRenderLibrary = this.followPath(this.library.sprites, render.source[1], 0);
        let filtered: Render | IRenderLibrary;

        // If found is a Render, create a new one as a filtered copy
        if (found.constructor === Render) {
            filtered = new Render((found as IRender).source, { filter });
            this.generateRenderSprite(filtered, key, attributes);
        } else {
            // Otherwise it's an IRenderLibrary; go through that recursively
            filtered = this.generateRendersFromFilter(found as IRenderLibrary, filter);
        }

        // The (now unused) render gives the filtered Render or directory to its containers
        this.replaceRenderInContainers(render, filtered);

        if (filtered.constructor === Render) {
            return (filtered as IRender).sprites[key];
        }

        this.baseFiler.clearCached(key);
        return this.decode(key, attributes);
    }

    /**
     * Recursively generates a directory of Renders from a filter. This is
     * similar to Library::parse, though the filter is added and references
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
            const child: Render | IRenderLibrary = directory[i] as Render | IRenderLibrary;

            if (child instanceof Render) {
                output[i] = new Render((child as IRender).source, { filter });
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
        let commaLocation: number;

        while (location < colors.length) {
            switch (colors[location]) {
                // A loop, ordered as 'x char times ,'
                case "x":
                    // Get the location of the ending comma
                    commaLocation = colors.indexOf(",", ++location);
                    if (commaLocation === -1) {
                        throw new Error(`Unclosed repeat loop at ${location}`);
                    }

                    const current: string = this.makeDigit(
                        paletteReference[colors.slice(location, location += digitsize)],
                        this.digitsizeDefault);
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
                        commaLocation = colors.indexOf("]");
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
     * @param _   The unique key identifying this chain of transforms.
     * @param attributes   Attributes describing the filter to use.
     * @returns The original series of color characters, filtered.
     */
    private spriteApplyFilter(colors: string, _: string, attributes: IFilterAttributes): string {
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
                // "...1234..." => [..., "12", "34", ...]
                const split: string[] = colors.match(this.digitsplit)!;

                // For each color filter to be applied, replace it
                for (const i in filter[1]) {
                    this.arrayReplace(split, i, filter[1][i]);
                }

                return split.join("");

            default:
                throw new Error(`Unknown filter: '${filterName}'.`);
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
        const split: string[] = colors.match(this.digitsplit)!;
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
     * @param _   The unique key identifying this chain of transforms.
     * @param attributes   The container Object (commonly a Thing in GameStarter), 
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, with rows repeated.
     */
    private spriteRepeatRows(sprite: Uint8ClampedArray, _: string, attributes: ISpriteAttributes): Uint8ClampedArray {
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

        for (let i: number = palette.length; i >= 1; i /= 10) {
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
     * Follows a path inside an Object recursively, based on a given path.
     * 
     * @param object   An Object to delve within.
     * @param path   The ordered names of attributes to descend into.
     * @param index   The starting index in path.
     * @returns A found element within object.
     */
    private followPath(object: any, path: string[], index: number): any {
        if (index < path.length && path[index] in object) {
            return this.followPath(object[path[index]], path, index + 1);
        }

        return object;
    }
}
