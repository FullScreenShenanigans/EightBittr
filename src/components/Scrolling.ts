import { Component } from "eightbittr/lib/component";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";

/**
 * Scrolling functions used by GameStartr instances.
 */
export class Scrolling<TGameStartr extends GameStartr> extends Component<TGameStartr> {
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
        dy = dy | 0;

        if (!dx && !dy) {
            return;
        }

        this.gameStarter.mapScreener.shift(dx, dy);
        this.gameStarter.physics.shiftAll(-dx, -dy);
        this.gameStarter.quadsKeeper.shiftQuadrants(-dx, -dy);
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
        this.gameStarter.physics.setLeft(thing, saveleft);
        this.gameStarter.physics.setTop(thing, savetop);
    }
}
