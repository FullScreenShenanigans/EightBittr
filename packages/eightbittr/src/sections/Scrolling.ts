import { VariableFunctions } from "mapscreenr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

import { Section } from "./Section";

/**
 * Moves the screen and Actors in it.
 */
export class Scrolling<Game extends EightBittr> extends Section<Game> {
    /**
     * A mapping of functions to generate member variables that should be
     * recomputed on screen change, keyed by variable name.
     */
    public readonly variableFunctions?: VariableFunctions;

    /**
     * Scrolls the game window by shifting all Actors and checking for quadrant
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
     * Scrolls everything but a single Actor.
     *
     * @param actor   The only Actor that shouldn't move on the screen.
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public scrollActor(actor: Actor, dx: number, dy?: number): void {
        const saveleft: number = actor.left;
        const savetop: number = actor.top;

        this.scrollWindow(dx, dy);
        this.game.physics.setLeft(actor, saveleft);
        this.game.physics.setTop(actor, savetop);
    }
}
