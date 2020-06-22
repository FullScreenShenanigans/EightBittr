import { EightBittr } from "../../EightBittr";
import { IThing } from "../../IEightBittr";
import { GeneralComponent } from "../GeneralComponent";

/**
 * Visually flips Things.
 */
export class Flipping<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * Marks a Thing as being flipped horizontally by setting its .flipHoriz
     * attribute to true and giving it a "flipped" class.
     *
     * @param thing
     */
    public flipHoriz(thing: IThing): void {
        thing.flipHoriz = true;
        this.eightBitter.graphics.classes.addClass(thing, "flipped");
    }

    /**
     * Marks a Thing as being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     *
     * @param thing
     */
    public flipVert(thing: IThing): void {
        thing.flipVert = true;
        this.eightBitter.graphics.classes.addClass(thing, "flip-vert");
    }

    /**
     * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
     * attribute to false and giving it a "flipped" class.
     *
     * @param thing
     */
    public unflipHoriz(thing: IThing): void {
        thing.flipHoriz = false;
        this.eightBitter.graphics.classes.removeClass(thing, "flipped");
    }

    /**
     * Marks a Thing as not being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     *
     * @param thing
     */
    public unflipVert(thing: IThing): void {
        thing.flipVert = false;
        this.eightBitter.graphics.classes.removeClass(thing, "flip-vert");
    }
}
