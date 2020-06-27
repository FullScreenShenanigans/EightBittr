import { IVariableFunctions } from "mapscreenr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

import { Section } from "./Section";

/**
 * Moves the screen and Things in it.
 */
export class Scrolling<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * A mapping of functions to generate member variables that should be
     * recomputed on screen change, keyed by variable name.
     */
    public readonly variableFunctions?: IVariableFunctions;

    /**
     * Scrolls the game window by shifting all Things and checking for quadrant
     * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
     *
     * @param customs   Any optional custom settings.
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public scrollWindow(dx: number, dy?: number): void {
        dx = dx | 0;
        dy = (dy || 0) | 0;

        if (!dx && !dy) {
            return;
        }

        this.game.mapScreener.shift(dx, dy);
        this.game.physics.shiftAll(-dx, -dy);
        this.game.quadsKeeper.shiftQuadrants(-dx, -dy);
    }

    /**
     * Scrolls everything but a single Thing.
     *
     * @param thing   The only Thing that shouldn't move on the screen.
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public scrollThing(thing: IThing, dx: number, dy?: number): void {
        const saveleft: number = thing.left;
        const savetop: number = thing.top;

        this.scrollWindow(dx, dy);
        this.game.physics.setLeft(thing, saveleft);
        this.game.physics.setTop(thing, savetop);
    }
}
