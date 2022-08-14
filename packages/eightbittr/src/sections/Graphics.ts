import { member } from "autofieldr";
import { FilterContainer, Palette } from "pixelrendr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";
import { Classes } from "./graphics/Classes";
import { Opacity } from "./graphics/Opacity";
import { Section } from "./Section";

/**
 * Actor pixel data and properties.
 */
export class Graphics<Game extends EightBittr> extends Section<Game> {
    /**
     * Initial background to set.
     */
    public readonly background?: string;

    /**
     * Filters that may be used by sprites in the library.
     */
    public readonly filters?: FilterContainer;

    /**
     * What class name should indicate an Actor is to be flipped verticallu.
     */
    public readonly flipVertical?: string;

    /**
     * What class name should indicate an Actor is to be flipped horizontally.
     */
    public readonly flipHorizontal?: string;

    /**
     * A nested library of sprites to process.
     */
    public readonly library?: any;

    /**
     * The default palette of colors to use for sprites.
     */
    public readonly paletteDefault?: Palette;

    /**
     * Amount to expand sprites by when processing.
     */
    public readonly scale?: number;

    /**
     * Maximum size of a SpriteMultiple to pre-render.
     */
    public readonly spriteCacheCutoff?: number;

    /**
     * Adds and removes visual classes for Actors.
     */
    @member(Classes)
    public readonly classes: Classes<Game>;

    /**
     * Changes the opacity of Actors.
     */
    @member(Opacity)
    public readonly opacity: Opacity<Game>;

    /**
     * Generates a key for an Actor based off the Actor's basic attributes.
     * This key should be used for PixelRender.get calls, to cache the Actor's
     * sprite.
     *
     * @param actor
     * @returns A key that to identify the Actor's sprite.
     */
    public generateActorKey(actor: Actor): string {
        return actor.groupType + " " + actor.title + " " + actor.className;
    }
}
