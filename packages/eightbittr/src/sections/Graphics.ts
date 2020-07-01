import { member } from "babyioc";
import { ITimeCycleSettings } from "classcyclr";
import { IFilterContainer, IPalette } from "pixelrendr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

import { Section } from "./Section";
import { Classes } from "./graphics/Classes";
import { Flipping } from "./graphics/Flipping";
import { Opacity } from "./graphics/Opacity";

/**
 * Settings to be passed in order to ClassCyclr::addClassCycle.
 */
export interface ISpriteCycleSettings {
    /**
     * Classes to create a class cycling event.
     */
    0: ITimeCycleSettings;

    /**
     * An optional name to store the cycling event under.
     */
    1?: string;

    /**
     * An optional way to determine how long to wait between classes.
     */
    2?: number | (() => number);
}

/**
 * Thing pixel data and properties.
 */
export class Graphics<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Initial background to set.
     */
    public readonly background?: string;

    /**
     * Filters that may be used by sprites in the library.
     */
    public readonly filters?: IFilterContainer;

    /**
     * What class name should indicate a Thing is to be flipped verticallu.
     */
    public readonly flipVert?: string;

    /**
     * What class name should indicate a Thing is to be flipped horizontally.
     */
    public readonly flipHoriz?: string;

    /**
     * A nested library of sprites to process.
     */
    public readonly library?: any;

    /**
     * The default palette of colors to use for sprites.
     */
    public readonly paletteDefault?: IPalette;

    /**
     * Amount to expand sprites by when processing.
     */
    public readonly scale?: number;

    /**
     * Maximum size of a SpriteMultiple to pre-render.
     */
    public readonly spriteCacheCutoff?: number;

    /**
     * Adds and removes visual classes for Things.
     */
    @member(Classes)
    public readonly classes: Classes<TEightBittr>;

    /**
     * Visually flips Things.
     */
    @member(Flipping)
    public readonly flipping: Flipping<TEightBittr>;

    /**
     * Changes the opacity of Things.
     */
    @member(Opacity)
    public readonly opacity: Opacity<TEightBittr>;

    /**
     * Generates a key for a Thing based off the Thing's basic attributes.
     * This key should be used for PixelRender.get calls, to cache the Thing's
     * sprite.
     *
     * @param thing
     * @returns A key that to identify the Thing's sprite.
     */
    public generateThingKey(thing: IThing): string {
        return thing.title + " " + thing.className;
    }
}
