import { Component } from "eightbittr/lib/Component";

import { GameStartr } from "./GameStartr";
import { IThing } from "./IGameStartr";

/**
 * Scrolling functions used by GameStartr instances.
 */
export class Scrolling<TIEightBittr extends GameStartr> extends Component<TIEightBittr> {
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

        this.EightBitter.MapScreener.shift(dx, dy);
        this.EightBitter.physics.shiftAll(-dx, -dy);
        this.EightBitter.QuadsKeeper.shiftQuadrants(-dx, -dy);
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
        this.EightBitter.physics.setLeft(thing, saveleft);
        this.EightBitter.physics.setTop(thing, savetop);
    }
}
