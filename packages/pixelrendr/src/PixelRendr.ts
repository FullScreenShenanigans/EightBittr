/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { StringFilr } from "stringfilr";

import { bindTransforms } from "./bindTransforms";
import { Library } from "./Library";
import { memcpyU8 } from "./memcpyU8";
import { Render } from "./Render";
import { SpriteMultiple } from "./SpriteMultiple";
import { SpriteSingle } from "./SpriteSingle";
import {
    Filter,
    FilterAttributes,
    FilterContainer,
    GeneralSpriteGenerator,
    LibraryRaws,
    Palette,
    PixelRendrSettings,
    RenderLibrary,
    SpriteAttributes,
    SpriteSingles,
    Transform,
} from "./types";

/**
 * Compresses images into text blobs in real time with fast cached lookups.
 */
export class PixelRendr {
    /**
     * Applies processing Functions to turn raw strings into partial sprites,
     * used during reset calls.
     */
    private readonly processorBase: Transform<string | any[], Uint8ClampedArray>;

    /**
     * Takes partial sprites and repeats rows, then checks for dimension
     * flipping, used during on-demand retrievals.
     */
    private readonly processorDims: Transform<Uint8ClampedArray>;

    /**
     * How much to "scale" each sprite by (repeat the pixels this much).
     */
    private readonly scale: number;

    /**
     * String key to know whether to flip a processed sprite vertically,
     * based on supplied attributes.
     */
    private readonly flipVertical: string;

    /**
     * String key to know whether to flip a processed sprite horizontally,
     * based on supplied attributes.
     */
    private readonly flipHorizontal: string;

    /**
     * Filters for processing sprites.
     */
    private readonly filters: FilterContainer;

    /**
     * Generators used to generate Renders from sprite commands.
     */
    private readonly commandGenerators: Record<string, GeneralSpriteGenerator>;

    /**
     * The base container for storing sprite information.
     */
    private library: Library;

    /**
     * A StringFilr interface on top of the base library.
     */
    private baseFiler: StringFilr<any>;

    /**
     * The default colors used for palettes in sprites.
     */
    private paletteDefault: Palette;

    /**
     * The default digit size (how many characters per number).
     */
    private digitSizeDefault: number;

    /**
     * Utility RegExp to split strings on every #digitSize characters.
     */
    private digitSplit: RegExp;

    /**
     * Initializes a new instance of the PixelRendr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: PixelRendrSettings = {}) {
        this.setPalette(settings.paletteDefault ?? [[0, 0, 0, 0]]);

        this.scale = settings.scale ?? 1;
        this.filters = settings.filters ?? {};
        this.flipVertical = settings.flipVertical ?? "flip-vertical";
        this.flipHorizontal = settings.flipHorizontal ?? "flip-horizontal";

        // The first ChangeLinr does the raw processing of strings to sprites
        // This is used to load & parse sprites into memory on startup
        this.processorBase = bindTransforms([
            this.spriteUnravel,
            this.spriteApplyFilter,
            this.spriteExpand,
            this.spriteGetArray,
        ]);

        // The second ChangeLinr does row repeating and flipping
        // This is done on demand when given a sprite's settings Object
        this.processorDims = bindTransforms([this.spriteRepeatRows, this.spriteFlipDimensions]);

        this.commandGenerators = {
            filter: this.generateSpriteCommandFilterFromRender,
            multiple: this.generateSpriteCommandMultipleFromRender,
            same: this.generateSpriteCommandSameFromRender,
        };

        this.resetLibrary(settings.library);
    }

    /**
     * @returns The default colors used for palettes in sprites.
     */
    public getPaletteDefault(): Palette {
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
    public getLibrary(): Library {
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
    public getBaseFiler(): StringFilr<string[] | any> {
        return this.baseFiler;
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
    public resetLibrary(raws: LibraryRaws = {}): void {
        this.library = new Library(raws);

        // The BaseFiler provides a searchable 'view' on the library of sprites
        this.baseFiler = new StringFilr({
            library: this.library.sprites,
            normal: "normal", // To do: put this somewhere more official?
        });
    }

    /**
     * Resets an individual rendered sprite.
     *
     * @param key   The key of the sprite to render.
     */
    public resetRender(key: string): void {
        const result: Render | RenderLibrary = this.baseFiler.get(key);

        if (result === this.library.sprites) {
            throw new Error(`No render found for '${key}'.`);
        }

        (result as Render).sprites = {};
    }

    /**
     * Replaces the current palette with a new one.
     *
     * @param palette   The new palette to replace the current one.
     */
    public changePalette(palette: Palette): void {
        this.setPalette(palette);

        for (const sprite in this.library.sprites) {
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
     *                    Numbers are required.
     * @returns A sprite for the given key and attributes.
     */
    public decode(key: string, attributes: any): SpriteSingle | SpriteMultiple {
        const result: Render | RenderLibrary = this.baseFiler.get(key);
        if (!(result instanceof Render)) {
            throw new Error(`No sprite found for '${key}'.`);
        }

        // If the render doesn't have a listing for this key, create one
        if (!{}.hasOwnProperty.call(result.sprites, key)) {
            this.generateRenderSprite(result, key, attributes);
        }

        const sprite = result.sprites[key];
        if (!sprite) {
            throw new Error(`Could not generate sprite for '${key}'.`);
        }

        return sprite;
    }

    /**
     * Generates a sprite for a Render based on its internal source and an
     * externally given String key and attributes Object. The sprite is stored
     * in the Render's sprites container under that key.
     *
     * @para render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite
     *                    generation process.
     */
    private generateRenderSprite(render: Render, key: string, attributes: any): void {
        render.sprites[key] =
            typeof render.source === "string"
                ? this.generateSpriteSingleFromRender(render, key, attributes)
                : this.commandGenerators[render.source[0]](render, key, attributes);
    }

    /**
     * Generates the pixel data for a single sprite.
     *
     * @param ender   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation
     *                    process.
     * @returns   The output sprite.
     */
    private generateSpriteSingleFromRender(
        render: Render,
        key: string,
        attributes: any
    ): SpriteSingle {
        const base = this.processorBase(render.source, key, render.filter);

        return new SpriteSingle(this.processorDims(base, key, attributes));
    }

    /**
     * Generates the pixel data for a SpriteMultiple to be generated by creating
     * a container in a new SpriteMultiple and filing it with processed single
     * sprites.
     *
     * @param render   A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation
     *                    process.
     * @returns The output sprite.
     */
    private readonly generateSpriteCommandMultipleFromRender = (
        render: Render,
        key: string,
        attributes: any
    ) => {
        const sources: any = render.source[2];
        const sprites: SpriteSingles = {};

        for (const i in sources) {
            const path = `${key} ${i}`;
            const sprite: any = this.processorBase(sources[i], path, render.filter);
            sprites[i] = new SpriteSingle(this.processorDims(sprite, path, attributes));
        }

        return new SpriteMultiple(sprites, render.source);
    };

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
    private readonly generateSpriteCommandSameFromRender = (
        render: Render,
        key: string,
        attributes: any
    ) => {
        const replacement: Render | RenderLibrary = this.followPath(
            this.library.sprites,
            render.source[1],
            0
        );

        // The (now temporary) Render's containers are given the Render or directory
        // Referenced by the source path
        this.replaceRenderInContainers(render, replacement);

        // BaseFiler will need to remember the new entry for the key,
        // So the cache is cleared and decode restarted
        this.baseFiler.clearCached(key);
        return this.decode(key, attributes);
    };

    /**
     * Generates the output of a "filter" command. The referenced Render or
     * directory are found, converted into a filtered Render or directory, and
     * this.decode is used to find the output.
     *
     * @param render  A render whose sprite is being generated.
     * @param key   The key under which the sprite is stored.
     * @param attributes   Any additional information to pass to the sprite generation
     *                    process.
     * @returns The output sprite.
     */
    private readonly generateSpriteCommandFilterFromRender = (
        render: Render,
        key: string,
        attributes: FilterAttributes
    ) => {
        const filter: Filter = this.filters[render.source[2]];
        if (!filter) {
            throw new Error(`Invalid filter provided: '${render.source[2]}'.`);
        }

        const found: Render | RenderLibrary = this.followPath(
            this.library.sprites,
            render.source[1],
            0
        );
        let filtered: Render | RenderLibrary;

        // If found is a Render, create a new one as a filtered copy
        if (found.constructor === Render) {
            filtered = new Render(found.source, { filter });
            this.generateRenderSprite(filtered, key, attributes);
        } else {
            // Otherwise it's an IRenderLibrary; go through that recursively
            filtered = this.generateRendersFromFilter(found as RenderLibrary, filter);
        }

        // The (now unused) render gives the filtered Render or directory to its containers
        this.replaceRenderInContainers(render, filtered);

        if (filtered.constructor === Render) {
            return filtered.sprites[key];
        }

        this.baseFiler.clearCached(key);
        return this.decode(key, attributes);
    };

    /**
     * Recursively generates a directory of Renders from a filter. This is
     * similar to Library::parse, though the filter is added and references
     * aren't.
     *
     * @param director   The current directory of Renders to create filtered versions
     *                   of.
     * @param filter   The filter being applied.
     * @returns An output directory containing Renders with the filter.
     */
    private generateRendersFromFilter(directory: RenderLibrary, filter: Filter): RenderLibrary {
        const output: RenderLibrary = {};

        for (const i in directory) {
            const child: Render | RenderLibrary = directory[i] as Render | RenderLibrary;

            output[i] =
                child instanceof Render
                    ? new Render(child.source, { filter })
                    : this.generateRendersFromFilter(child, filter);
        }

        return output;
    }

    /**
     * Switches all of a given Render's containers to point to a replacement instead.
     *
     * @param render   ARender being replaced.
     * @param replacement   A replacement for render.
     */
    private replaceRenderInContainers(render: Render, replacement: Render | RenderLibrary): void {
        for (const listing of render.containers) {
            listing.container[listing.key] = replacement;

            if (replacement.constructor === Render) {
                replacement.containers.push(listing);
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
    private readonly spriteUnravel = (colors: string) => {
        let paletteReference = this.getPaletteReferenceStarting(this.paletteDefault);
        let digitSize = this.digitSizeDefault;
        let location = 0;
        let output = "";
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

                    const current = this.makeDigit(
                        paletteReference[colors.slice(location, (location += digitSize))],
                        this.digitSizeDefault
                    );
                    let repetitions = parseInt(colors.slice(location, commaLocation), 10);
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
                        paletteReference = this.getPaletteReference(
                            colors.slice(location + 1, commaLocation).split(",")
                        );
                        location = commaLocation + 1;
                        digitSize = this.getDigitSizeFromObject(paletteReference);
                    } else {
                        // Otherwise go back to default
                        paletteReference = this.getPaletteReference(this.paletteDefault);
                        digitSize = this.digitSizeDefault;
                    }
                    break;

                // A typical number
                default:
                    output += this.makeDigit(
                        paletteReference[colors.slice(location, (location += digitSize))],
                        this.digitSizeDefault
                    );
                    break;
            }
        }

        return output;
    };

    /**
     * Repeats each number in the given string a number of times equal to the
     * scale. This is the second Function called by the base processor.
     *
     * @param colors   A seres of sprite colors.
     * @returns   The same series, with each character repeated.
     */
    private readonly spriteExpand = (colors: string) => {
        let output = "";
        let i = 0;

        // For each number,
        while (i < colors.length) {
            const current = colors.slice(i, (i += this.digitSizeDefault));

            // Put it into output as many times as needed
            for (let j = 0; j < this.scale; j += 1) {
                output += current;
            }
        }

        return output;
    };

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
    private readonly spriteApplyFilter = (
        colors: string,
        _: string,
        attributes: FilterAttributes
    ) => {
        // If there isn't a filter (as is the norm), just return the sprite
        if (!attributes || !attributes.filter) {
            return colors;
        }

        const filter: Filter = attributes.filter;
        const filterName = filter[0];

        if (!filterName) {
            return colors;
        }

        switch (filterName) {
            // Palette filters switch all instances of one color with another
            case "palette":
                // Split the colors on on each digit
                // "...1234..." => [..., "12", "34", ...]
                const split: string[] = colors.match(this.digitSplit)!;

                // For each color filter to be applied, replace it
                for (const i in filter[1]) {
                    this.arrayReplace(split, i, filter[1][i]);
                }

                return split.join("");

            default:
                throw new Error(`Unknown filter: '${filterName}'.`);
        }
    };

    /**
     * Converts an unraveled String of sprite numbers to the equivalent RGBA
     * Uint8ClampedArray. Each colors number will be represented by four numbers
     * in the output. This is the fourth Function called in the base processor.
     *
     * @param colors   A series of color characters.
     * @returns A series of pixels equivalent to the colors.
     */
    private readonly spriteGetArray = (colors: string) => {
        const numColors = colors.length / this.digitSizeDefault;
        const split: string[] = colors.match(this.digitSplit)!;
        const output: Uint8ClampedArray = new Uint8ClampedArray(numColors * 4);

        let i = 0;
        let j = 0;

        // For each color...
        while (i < numColors) {
            // Grab its RGBA ints
            const reference: number[] = this.paletteDefault[Number(split[i])];

            // Place each in output
            for (let k = 0; k < 4; k += 1) {
                output[j + k] = reference[k];
            }

            i += 1;
            j += 4;
        }

        return output;
    };

    /**
     * Repeats each row of a sprite based on the container attributes to create
     * the actual sprite (before now, the sprite was 1 / scale as high as it
     * should have been). This is the first Function called in the dimensions
     * processor.
     *
     * @param sprite   A series of sprite pixels.
     * @param _   The unique key identifying this chain of transforms.
     * @param attributes   The container Object (commonly an Actor in EightBitter),
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, with rows repeated.
     */
    private readonly spriteRepeatRows = (
        sprite: Uint8ClampedArray,
        _: string,
        attributes: SpriteAttributes
    ) => {
        const parsed: Uint8ClampedArray = new Uint8ClampedArray(sprite.length * this.scale);
        const rowSize = attributes.spriteWidth! * 4;
        const height = attributes.spriteHeight! / this.scale;
        let readLocation = 0;
        let writeLocation = 0;

        // For each row:
        for (let i = 0; i < height; i += 1) {
            // Add it to parsed x scale
            for (let j = 0; j < this.scale; j += 1) {
                memcpyU8(sprite, parsed, readLocation, writeLocation, rowSize);
                writeLocation += rowSize;
            }

            readLocation += rowSize;
        }

        return parsed;
    };

    /**
     * Optionally flips a sprite based on the flipVertical and flipHorizontal keys. This
     * is the second Function in the dimensions processor and the last step
     * before a sprite is deemed usable.
     *
     * @param sprite   A series o sprite pixels.
     * @param key   The unique key identifying this chain of transforms.
     * @param attributes   The container Object (commonly an Actor in EightBitter),
     *                     which mst contain width and height numbers.
     * @returns A version of the original sprite, with dimensions flipped.
     */
    private readonly spriteFlipDimensions = (
        sprite: Uint8ClampedArray,
        key: string,
        attributes: SpriteAttributes
    ) => {
        if (key.includes(this.flipHorizontal)) {
            if (key.includes(this.flipVertical)) {
                return this.flipSpriteArrayBoth(sprite);
            }

            return this.flipSpriteArrayHorizontal(sprite, attributes);
        }

        if (key.includes(this.flipVertical)) {
            return this.flipSpriteArrayVertical(sprite, attributes);
        }

        return sprite;
    };

    /**
     * Flips a sprite horizontally by reversing the pixels within each row. Rows
     * are computing using the spriteWidth in attributes.
     *
     * @param sprite   A series of sprite pixels.
     * @param attributes   The container Object (commonly an Actor in EightBitter),
     *                     which mus contain width and height numbers.
     * @returns A version of the original sprite, flipped horizontally.
     */
    private flipSpriteArrayHorizontal(
        sprite: Uint8ClampedArray,
        attributes: SpriteAttributes
    ): Uint8ClampedArray {
        const length = sprite.length + 0;
        const width = attributes.spriteWidth! + 0;
        const spriteFlipped: Uint8ClampedArray = new Uint8ClampedArray(length);
        const rowSize = width * 4;

        // For each row:
        for (let i = 0; i < length; i += rowSize) {
            let newLocation = i;
            let oldLocation = i + rowSize - 4;

            // For each pixel:
            for (let j = 0; j < rowSize; j += 4) {
                // Copy it over
                for (let k = 0; k < 4; k += 1) {
                    spriteFlipped[newLocation + k] = sprite[oldLocation + k];
                }

                newLocation += 4;
                oldLocation -= 4;
            }
        }

        return spriteFlipped;
    }

    /**
     * Flips a sprite vertically by reversing the order of the rows. Rows are
     * computing using the spriteWidth in attributes.
     *
     * @param sprite   A series of spite pixels.
     * @param attributes   The container Object (commonly an Actor in EightBitter),
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, flipped vertically.
     */
    private flipSpriteArrayVertical(
        sprite: Uint8ClampedArray,
        attributes: SpriteAttributes
    ): Uint8ClampedArray {
        const length = sprite.length + 0;
        const width = attributes.spriteWidth! + 0;
        const spriteFlipped: Uint8ClampedArray = new Uint8ClampedArray(length);
        const rowSize = width * 4;
        let oldIndex = length - rowSize;
        let newIndex = 0;

        // For each row
        while (newIndex < length) {
            // For each pixel in the rows
            for (let i = 0; i < rowSize; i += 4) {
                // For each rgba value
                for (let j = 0; j < 4; j += 1) {
                    spriteFlipped[newIndex + i + j] = sprite[oldIndex + i + j];
                }
            }

            newIndex += rowSize;
            oldIndex -= rowSize;
        }

        return spriteFlipped;
    }

    /**
     * Flips a sprite horizontally and vertically by reversing the order of the
     * pixels. This doesn't actually need attributes.
     *
     * @param sprite   A series of sprite pixels.
     * @param attributes   The container Object (commonly an Actor in EightBitter),
     *                     which must contain width and height numbers.
     * @returns A version of the original sprite, flipped horizontally and vertically.
     */
    private flipSpriteArrayBoth(sprite: Uint8ClampedArray): Uint8ClampedArray {
        const length = sprite.length + 0;
        const spriteFlipped: Uint8ClampedArray = new Uint8ClampedArray(length);
        let oldIndex = length - 4;
        let newIndex = 0;

        while (newIndex < length) {
            for (let i = 0; i < 4; i += 1) {
                spriteFlipped[newIndex + i] = sprite[oldIndex + i];
            }

            newIndex += 4;
            oldIndex -= 4;
        }

        return spriteFlipped;
    }

    /**
     * Sets the palette and digitSize Default/digitSplit based off that palette.
     *
     * @param palette   The palette being assigned to paletteDefault.
     */
    private setPalette(palette: Palette): void {
        this.paletteDefault = palette;
        this.digitSizeDefault = this.getDigitSizeFromArray(this.paletteDefault);
        this.digitSplit = new RegExp(`.{1,${this.digitSizeDefault}}`, "g");
    }

    /**
     * Determines how many digits will be required to represent a member of
     * the palette.
     *
     * @param palette   A palette of color.
     * @returns The equivalent digitSize for the palette.
     */
    private getDigitSizeFromArray(palette: any[]): number {
        let digitSize = 0;

        for (let i = palette.length; i >= 1; i /= 10) {
            digitSize += 1;
        }

        return digitSize;
    }

    /**
     * Determines how many digits will be required to represent a member of
     * the palette.
     *
     * @param palette   A palette of colors
     * @returns The equivalent digitSize for the palette.
     */
    private getDigitSizeFromObject(palette: any): number {
        return this.getDigitSizeFromArray(Object.keys(palette));
    }

    /**
     * Generates an actual palette Object for a given palette, using a digitSize
     * calculated from the palette.
     *
     * @param palette   A palette of colors
     * @returns The actual palette Object for the given palette, with an index
     *          for every palette member.
     */
    private getPaletteReference(palette: any[]): any {
        const output: any = {};
        const digitSize = this.getDigitSizeFromArray(palette);

        for (let i = 0; i < palette.length; i += 1) {
            output[this.makeDigit(i, digitSize)] = this.makeDigit(palette[i], digitSize);
        }

        return output;
    }

    /**
     * Generates an actual palette Object for a given palette, using the default
     * digitSize.
     *
     * @param palette   A palette of colors.
     * @returns The actual palette Object for the given palette, with an index
     *          for every palette member.
     */
    private getPaletteReferenceStarting(palette: Palette): any {
        const output: any = {};

        for (let i = 0; i < palette.length; i += 1) {
            const digit = this.makeDigit(i, this.digitSizeDefault);
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
        return times === 0 ? "" : new Array((times ?? 1) + 1).join(text);
    }

    /**
     * Turns a Number into a String with a prefix added to pad it to a certain
     * number of digits.
     *
     * @param number   The original Number being added.
     * @param size   How many digits the output must contain.
     * @param prefix   A prefix to repeat for padding (by default, "0").
     * @returns A Stringified digit of the given length.
     * @example makeDigit(7, 3); // '007'
     * @example makeDigit(7, 3, 1); // '117'
     */
    private makeDigit(num: number | string, size: number, prefix = "0"): string {
        return `${this.stringOf(prefix, Math.max(0, size - String(num).length))}${num}`;
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
        for (let i = 0; i < array.length; i += 1) {
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
