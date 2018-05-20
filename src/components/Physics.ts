import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";
import { GeneralComponent } from "./GeneralComponent";

/**
 * Physics functions to move Things around.
 */
export class Physics<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * @returns The horizontal midpoint of the Thing.
     */
    public getMidX(thing: IThing): number {
        return thing.left + thing.width / 2;
    }

    /**
     * @returns The vertical midpoint of the Thing.
     */
    public getMidY(thing: IThing): number {
        return thing.top + thing.height / 2;
    }

    /**
     * Generically kills a Thing by setting its alive to false, hidden to true,
     * and clearing its movement.
     *
     * @param thing
     */
    public killNormal(thing: IThing): void {
        if (!thing) {
            return;
        }

        thing.alive = false;
        thing.hidden = true;
        thing.movement = undefined;
    }

    /**
     * Increases a Thing's width by pushing forward its right and decreasing its
     * width. It is marked as changed in appearance.
     *
     * @param thing
     * @param dx   How much to increase the Thing's width.
     */
    public increaseWidth(thing: IThing, dx: number): void {
        thing.right += dx;
        thing.width += dx;

        this.markChanged(thing);
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its
     * height. It is marked as changed in appearance.
     *
     * @param thing
     * @param dy   How much to increase the Thing's height.
     * @param updateSize   Whether to also call updateSize on the Thing (by default, false).
     */
    public increaseHeight(thing: IThing, dy: number): void {
        thing.top -= dy;
        thing.height += dy;

        this.markChanged(thing);
    }

    /**
     * Marks a Thing as having changed this upkeep.
     */
    public markChanged(thing: IThing): void {
        thing.changed = true;
    }

    /**
     * Sets a Thing's bottom.
     *
     * @param bottom   A new bottom border for the Thing.
     */
    public setBottom(thing: IThing, bottom: number): void {
        thing.bottom = bottom;
        thing.top = thing.bottom - thing.height;

        this.markChanged(thing);
    }

    /**
     * Sets the height and unitheight of a Thing, and optionally updates the
     * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
     *
     * @param thing
     * @param height   A new height for the Thing.
     * @param updateSprite   Whether to update the Thing's canvas (by default, false).
     * @param updateSize   Whether to call updateSize on the Thing (by default, false).
     */
    public setHeight(thing: IThing, height: number, updateSprite?: boolean): void {
        thing.height = height;

        if (updateSprite) {
            thing.spriteheight = height;
        }

        this.markChanged(thing);
    }

    /**
     * Sets a Thing's left.
     *
     * @param thing
     * @param left   A new left border for the Thing.
     */
    public setLeft(thing: IThing, left: number): void {
        thing.left = left;
        thing.right = thing.left + thing.width;

        this.markChanged(thing);
    }

    /**
     * Shifts a Thing so that it is centered on the given x and y.
     *
     * @param thing   The Thing to shift vertically and horizontally.
     * @param x   Where the Thing's horizontal midpoint should be.
     * @param y   Where the Thing's vertical midpoint should be.
     */
    public setMid(thing: IThing, x: number, y: number): void {
        this.setMidX(thing, x);
        this.setMidY(thing, y);
    }

    /**
     * Shifts a Thing so that its midpoint is centered on the midpoint of the
     * other Thing.
     *
     * @param thing   The Thing to be shifted.
     * @param other   The Thing whose midpoint is referenced.
     */
    public setMidObj(thing: IThing, other: IThing): void {
        this.setMidXObj(thing, other);
        this.setMidYObj(thing, other);
    }

    /**
     * Shifts a Thing so that it is horizontally centered on the given x.
     *
     * @param thing   The Thing to shift horizontally.
     * @param x   Where the Thing's horizontal midpoint should be.
     */
    public setMidX(thing: IThing, x: number): void {
        this.setLeft(thing, x - thing.width / 2);
    }

    /**
     * Shifts a Thing so that its horizontal midpoint is centered on the
     * midpoint of the other Thing.
     *
     * @param thing   The Thing to be shifted horizontally.
     * @param other   The Thing whose horizontal midpoint is referenced.
     */
    public setMidXObj(thing: IThing, other: IThing): void {
        this.setLeft(thing, this.getMidX(other) - (thing.width / 2));
    }

    /**
     * Shifts a Thing so that it is vertically centered on the given y.
     *
     * @param thing   The Thing to shift vertically.
     * @param y   Where the Thing's vertical midpoint should be.
     */
    public setMidY(thing: IThing, y: number): void {
        this.setTop(thing, y - thing.height / 2);
    }

    /**
     * Shifts a Thing so that its vertical midpoint is centered on the
     * midpoint of the other Thing.
     *
     * @param thing   The Thing to be shifted vertically.
     * @param other   The Thing whose vertical midpoint is referenced.
     */
    public setMidYObj(thing: IThing, other: IThing): void {
        this.setTop(thing, this.getMidY(other) - (thing.height / 2));
    }

    /**
     * Sets a Thing's right.
     *
     * @param right   A new right border for the Thing.
     */
    public setRight(thing: IThing, right: number): void {
        thing.right = right;
        thing.left = thing.right - thing.width;

        this.markChanged(thing);
    }

    /**
     * Sets a Thing's top.
     *
     * @param top   A new top border for the Thing.
     */
    public setTop(thing: IThing, top: number): void {
        thing.top = top;
        thing.bottom = thing.top + thing.height;

        this.markChanged(thing);
    }

    /**
     * Sets the width and unitwidth of a Thing, and optionally updates the
     * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     *
     * @param thing
     * @param width   A new width for the Thing.
     * @param updateSprite   Whether to update the Thing's canvas (by default, false).
     * @param updateSize   Whether to call updateSize on the Thing (by
     *                     default, false).
     */
    public setWidth(thing: IThing, width: number, updateSprite?: boolean): void {
        thing.width = width;

        if (updateSprite) {
            thing.spritewidth = width;
        }

        this.markChanged(thing);
    }

    /**
     * Shifts a thing both horizontally and vertically. If the Thing marks
     * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
     * proportion of movement is respected (.5 = half, etc.).
     *
     * @param dx   How far to shift the Thing horizontally.
     * @param dy   How far to shift the Thing vertically.
     */
    public shiftBoth(thing: IThing, dx: number, dy: number): void {
        dx = dx || 0;
        dy = dy || 0;

        if (!thing.noshiftx) {
            if (thing.parallaxHoriz) {
                this.shiftHoriz(thing, thing.parallaxHoriz * dx);
            } else {
                this.shiftHoriz(thing, dx);
            }
        }

        if (!thing.noshifty) {
            if (thing.parallaxVert) {
                this.shiftVert(thing, thing.parallaxVert * dy);
            } else {
                this.shiftVert(thing, dy);
            }
        }
    }

    /**
     * Shifts a Thing horizontally.
     *
     * @param dx   How far to shift the Thing horizontally.
     */
    public shiftHoriz(thing: IThing, dx: number): void {
        thing.left += dx;
        thing.right += dx;

        this.markChanged(thing);
    }

    /**
     * Calls shiftBoth on all members of an Array.
     *
     * @param dx   How far to shift the Things horizontally.
     * @param dy   How far to shift the Things vertically.
     */
    public shiftThings(things: IThing[], dx: number, dy: number): void {
        for (const thing of things) {
            this.shiftBoth(thing, dx, dy);
        }
    }

    /**
     * Shifts a Thing vertically.
     *
     * @param dy   How far to shift the Thing vertically.
     */
    public shiftVert(thing: IThing, dy: number): void {
        thing.top += dy;
        thing.bottom += dy;

        this.markChanged(thing);
    }

    /**
     * Calls shiftBoth on all groups of Things.
     *
     * @param dx   How far to shift the Things horizontally.
     * @param dy   How far to shift the Things vertically.
     */
    public shiftAll(dx: number, dy: number): void {
        this.eightBitter.groupHolder.callOnAll((thing: IThing): void => {
            this.shiftBoth(thing, dx, dy);
        });
    }

    /**
     * Calls both setWidth and setHeight on a Thing.
     *
     * @param thing
     * @param width   A new width for the Thing.
     * @param height   A new height for the Thing.
     * @param updateSprite   Whether to update the Thing's canvas (by default, false).
     */
    public setSize(thing: IThing, width: number, height: number, updateSprite?: boolean): void {
        this.setWidth(thing, width, updateSprite);
        this.setHeight(thing, height, updateSprite);
    }

    /**
     * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
     * shiftHoriz and shiftVert.
     *
     * @param thing
     */
    public updatePosition(thing: IThing): void {
        this.shiftHoriz(thing, thing.xvel);
        this.shiftVert(thing, thing.yvel);
    }

    /**
     * Reduces a Thing's width by pushing back its right and decreasing its
     * width. It is marked as changed in appearance.
     *
     * @param thing
     * @param dx   How much to reduce the Thing's width.
     */
    public reduceWidth(thing: IThing, dx: number): void {
        thing.right -= dx;
        thing.width -= dx;

        this.markChanged(thing);
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its
     * height. It is marked as changed in appearance.
     *
     * @param thing
     * @param dy   How much to reduce the Thing's height.
     */
    public reduceHeight(thing: IThing, dy: number): void {
        thing.top += dy;
        thing.height -= dy;

        this.markChanged(thing);
    }

    /**
     * Shifts a Thing toward a target x, but limits the total distance allowed.
     * Distance is computed as from the Thing's horizontal midpoint.
     *
     * @param thing   The Thing to be shifted horizontally.
     * @param dx   How far to shift the Thing horizontally.
     * @param maxDistance   The maximum distance the Thing can be shifted (by
     *                      default, Infinity for no maximum).
     */
    public slideToX(thing: IThing, dx: number, maxDistance: number = Infinity): void {
        const midx: number = this.getMidX(thing);

        if (midx < dx) {
            this.shiftHoriz(thing, Math.min(maxDistance, dx - midx));
        } else {
            this.shiftHoriz(thing, Math.max(-maxDistance, dx - midx));
        }
    }

    /**
     * Shifts a Thing toward a target y, but limits the total distance allowed.
     * Distance is computed as from the Thing's vertical midpoint.
     *
     * @param thing   The Thing to be shifted vertically.
     * @param dy   How far to shift the Thing vertically.
     * @param maxDistance   The maximum distance the Thing can be shifted (by
     *                      default, Infinity, for no maximum).
     */
    public slideToY(thing: IThing, dy: number, maxDistance: number = Infinity): void {
        const midy: number = this.getMidY(thing);

        if (midy < dy) {
            this.shiftVert(thing, Math.min(maxDistance, dy - midy));
        } else {
            this.shiftVert(thing, Math.max(-maxDistance, dy - midy));
        }
    }

    /**
     * @param thing
     * @param other
     * @returns Whether the first Thing's vertical midpoint is to the left
     *          of the other's.
     */
    public thingAbove(thing: IThing, other: IThing): boolean {
        return this.getMidY(thing) < this.getMidY(other);
    }

    /**
     * @param thing
     * @param other
     * @returns Whether the first Thing's horizontal midpoint is to the left
     *          of the other's.
     */
    public thingToLeft(thing: IThing, other: IThing): boolean {
        return this.getMidX(thing) < this.getMidX(other);
    }

    /**
     * Shifts a Thing's top up, then sets the bottom (similar to a shiftVert and
     * a setTop combined).
     *
     * @param thing   The Thing to be shifted vertically.
     * @param dy   How far to shift the Thing vertically (by default, 0).
     */
    public updateTop(thing: IThing, dy: number = 0): void {
        thing.top += dy;
        thing.bottom = thing.top + thing.height;

        this.markChanged(thing);
    }

    /**
     * Shifts a Thing's right, then sets the left (similar to a shiftHoriz and a
     * setRight combined).
     *
     * @param thing   The Thing to be shifted horizontally.
     * @param dx   How far to shift the Thing horizontally (by default, 0).
     */
    public updateRight(thing: IThing, dx: number = 0): void {
        thing.right += dx;
        thing.left = thing.right - thing.width;

        this.markChanged(thing);
    }

    /**
     * Shifts a Thing's bottom down, then sets the bottom (similar to a
     * shiftVert and a setBottom combined).
     *
     * @param thing   The Thing to be shifted vertically.
     * @param dy   How far to shift the Thing vertically (by default, 0).
     */
    public updateBottom(thing: IThing, dy: number = 0): void {
        thing.bottom += dy;
        thing.top = thing.bottom - thing.height;

        this.markChanged(thing);
    }

    /**
     * Shifts a Thing's left, then sets the right (similar to a shiftHoriz and a
     * setLeft combined).
     *
     * @param thing   The Thing to be shifted horizontally.
     * @param dx   How far to shift the Thing horizontally (by default, 0).
     */
    public updateLeft(thing: IThing, dx: number = 0): void {
        thing.left += dx;
        thing.right = thing.left + thing.width;

        this.markChanged(thing);
    }
}
