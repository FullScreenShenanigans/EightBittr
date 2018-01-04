import { dependency } from "babyioc";
import { MapScreenr } from "mapscreenr";
import { QuadsKeepr } from "quadskeepr";

import { GameStartr } from "../GameStartr";
import { IThing } from "../IGameStartr";
import { Physics } from "./Physics";

/**
 * Scrolling functions used by GameStartr instances.
 */
export class Scrolling {
    @dependency(MapScreenr)
    private readonly mapScreener: MapScreenr;

    @dependency(Physics)
    private readonly physics: Physics;

    @dependency(QuadsKeepr)
    private readonly quadsKeeper: QuadsKeepr<IThing>;

    /**
     * Scrolls the game window by shifting all Things and checking for quadrant
     * refreshes. Shifts are rounded to the nearest integer, to preserve pixels.
     *
     * @param customs   Any optional custom settings.
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public scrollWindow(dx: number, dy?: number): void {
        // tslint:disable:no-parameter-reassignment
        dx = dx | 0;
        dy = (dy || 0) | 0;
        // tslint:enable:no-parameter-reassignment

        if (!dx && !dy) {
            return;
        }

        this.mapScreener.shift(dx, dy);
        this.physics.shiftAll(-dx, -dy);
        this.quadsKeeper.shiftQuadrants(-dx, -dy);
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
        this.physics.setLeft(thing, saveleft);
        this.physics.setTop(thing, savetop);
    }
}
