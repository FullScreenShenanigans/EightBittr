import { IMapScreenr } from "mapscreenr/lib/IMapScreenr";
import { IQuadsKeepr } from "quadskeepr/lib/IQuadsKeepr";

import { IThing } from "../IGameStartr";
import { Physics } from "./Physics";

/**
 * Scrolling functions used by GameStartr instances.
 */
export class Scrolling {
    /**
     * A flexible container for map attributes and viewport.
     */
    private readonly mapScreener: IMapScreenr;

    /**
     * Physics functions used by GameStartr instances.
     */
    private readonly physics: Physics;

    /**
     * Adjustable quadrant-based collision detection.
     */
    private readonly quadsKeeper: IQuadsKeepr<IThing>;

    /**
     * Initializes a new instance of the Scrolling class.
     * 
     * @param mapScreener   A flexible container for map attributes and viewport.
     * @param physics   Physics functions used by GameStartr instances.
     * @param quadsKeeper   Adjustable quadrant-based collision detection.
     */
    public constructor(mapScreener: IMapScreenr, physics: Physics, quadsKeeper: IQuadsKeepr<IThing>) {
        this.mapScreener = mapScreener;
        this.physics = physics;
        this.quadsKeeper = quadsKeeper;
    }

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
