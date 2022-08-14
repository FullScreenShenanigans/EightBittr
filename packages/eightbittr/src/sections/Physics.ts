import { EightBittr } from "../EightBittr";
import { Actor } from "../types";
import { Section } from "./Section";

/**
 * Physics functions to move Actors around.
 */
export class Physics<Game extends EightBittr> extends Section<Game> {
    /**
     * @returns The horizontal midpoint of the Actor.
     */
    public getMidX(actor: Actor): number {
        return actor.left + actor.width / 2;
    }

    /**
     * @returns The vertical midpoint of the Actor.
     */
    public getMidY(actor: Actor): number {
        return actor.top + actor.height / 2;
    }

    /**
     * Increases An Actor's width by pushing forward its right and decreasing its
     * width. It is marked as changed in appearance.
     *
     * @param actor
     * @param dx   How much to increase the Actor's width.
     */
    public increaseWidth(actor: Actor, dx: number): void {
        actor.right += dx;
        actor.width += dx;

        this.markChanged(actor);
    }

    /**
     * Reduces An Actor's height by pushing down its top and decreasing its
     * height. It is marked as changed in appearance.
     *
     * @param actor
     * @param dy   How much to increase the Actor's height.
     * @param updateSize   Whether to also call updateSize on the Actor (by default, false).
     */
    public increaseHeight(actor: Actor, dy: number): void {
        actor.top -= dy;
        actor.height += dy;

        this.markChanged(actor);
    }

    /**
     * Marks An Actor as having changed this upkeep.
     */
    public markChanged(actor: Actor): void {
        actor.changed = true;
    }

    /**
     * Sets An Actor's bottom.
     *
     * @param bottom   A new bottom border for the Actor.
     */
    public setBottom(actor: Actor, bottom: number): void {
        actor.bottom = bottom;
        actor.top = actor.bottom - actor.height;

        this.markChanged(actor);
    }

    /**
     * Sets the height and unitheight of An Actor, and optionally updates the
     * Actor's spriteHeight and spriteHeight pixels, and/or calls updateSize.
     *
     * @param actor
     * @param height   A new height for the Actor.
     * @param updateSprite   Whether to update the Actor's canvas (by default, false).
     * @param updateSize   Whether to call updateSize on the Actor (by default, false).
     */
    public setHeight(actor: Actor, height: number, updateSprite?: boolean): void {
        actor.height = height;

        if (updateSprite) {
            actor.spriteHeight = height;
        }

        this.markChanged(actor);
    }

    /**
     * Sets An Actor's left.
     *
     * @param actor
     * @param left   A new left border for the Actor.
     */
    public setLeft(actor: Actor, left: number): void {
        actor.left = left;
        actor.right = actor.left + actor.width;

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor so that it is centered on the given x and y.
     *
     * @param actor   The Actor to shift vertically and horizontally.
     * @param x   Where the Actor's horizontal midpoint should be.
     * @param y   Where the Actor's vertical midpoint should be.
     */
    public setMid(actor: Actor, x: number, y: number): void {
        this.setMidX(actor, x);
        this.setMidY(actor, y);
    }

    /**
     * Shifts An Actor so that its midpoint is centered on the midpoint of the
     * other Actor.
     *
     * @param actor   The Actor to be shifted.
     * @param other   The Actor whose midpoint is referenced.
     */
    public setMidObj(actor: Actor, other: Actor): void {
        this.setMidXObj(actor, other);
        this.setMidYObj(actor, other);
    }

    /**
     * Shifts An Actor so that it is horizontally centered on the given x.
     *
     * @param actor   The Actor to shift horizontally.
     * @param x   Where the Actor's horizontal midpoint should be.
     */
    public setMidX(actor: Actor, x: number): void {
        this.setLeft(actor, x - actor.width / 2);
    }

    /**
     * Shifts An Actor so that its horizontal midpoint is centered on the
     * midpoint of the other Actor.
     *
     * @param actor   The Actor to be shifted horizontally.
     * @param other   The Actor whose horizontal midpoint is referenced.
     */
    public setMidXObj(actor: Actor, other: Actor): void {
        this.setLeft(actor, this.getMidX(other) - actor.width / 2);
    }

    /**
     * Shifts An Actor so that it is vertically centered on the given y.
     *
     * @param actor   The Actor to shift vertically.
     * @param y   Where the Actor's vertical midpoint should be.
     */
    public setMidY(actor: Actor, y: number): void {
        this.setTop(actor, y - actor.height / 2);
    }

    /**
     * Shifts An Actor so that its vertical midpoint is centered on the
     * midpoint of the other Actor.
     *
     * @param actor   The Actor to be shifted vertically.
     * @param other   The Actor whose vertical midpoint is referenced.
     */
    public setMidYObj(actor: Actor, other: Actor): void {
        this.setTop(actor, this.getMidY(other) - actor.height / 2);
    }

    /**
     * Sets An Actor's right.
     *
     * @param right   A new right border for the Actor.
     */
    public setRight(actor: Actor, right: number): void {
        actor.right = right;
        actor.left = actor.right - actor.width;

        this.markChanged(actor);
    }

    /**
     * Sets An Actor's top.
     *
     * @param top   A new top border for the Actor.
     */
    public setTop(actor: Actor, top: number): void {
        actor.top = top;
        actor.bottom = actor.top + actor.height;

        this.markChanged(actor);
    }

    /**
     * Sets the width and unitwidth of An Actor, and optionally updates the
     * Actor's spriteWidth and spriteWidth pixels, and/or calls updateSize.
     * The actor is marked as having changed appearance.
     *
     * @param actor
     * @param width   A new width for the Actor.
     * @param updateSprite   Whether to update the Actor's canvas (by default, false).
     * @param updateSize   Whether to call updateSize on the Actor (by
     *                     default, false).
     */
    public setWidth(actor: Actor, width: number, updateSprite?: boolean): void {
        actor.width = width;

        if (updateSprite) {
            actor.spriteWidth = width;
        }

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor both horizontally and vertically.
     *
     * @param dx   How far to shift the Actor horizontally.
     * @param dy   How far to shift the Actor vertically.
     */
    public shiftBoth(actor: Actor, dx = 0, dy = 0): void {
        if (!dx && !dy) {
            return;
        }

        this.shiftHoriz(actor, dx);
        this.shiftVert(actor, dy);
    }

    /**
     * Shifts An Actor horizontally.
     *
     * @param dx   How far to shift the Actor horizontally.
     */
    public shiftHoriz(actor: Actor, dx: number): void {
        actor.left += dx;
        actor.right += dx;

        this.markChanged(actor);
    }

    /**
     * Calls shiftBoth on all members of an Array.
     *
     * @param dx   How far to shift the Actors horizontally.
     * @param dy   How far to shift the Actors vertically.
     */
    public shiftActors(actors: Actor[], dx: number, dy: number): void {
        for (const actor of actors) {
            this.shiftBoth(actor, dx, dy);
        }
    }

    /**
     * Shifts An Actor vertically.
     *
     * @param dy   How far to shift the Actor vertically.
     */
    public shiftVert(actor: Actor, dy: number): void {
        actor.top += dy;
        actor.bottom += dy;

        this.markChanged(actor);
    }

    /**
     * Calls shiftBoth on all groups of Actors.
     *
     * @param dx   How far to shift the Actors horizontally.
     * @param dy   How far to shift the Actors vertically.
     */
    public shiftAll(dx: number, dy: number): void {
        this.game.groupHolder.callOnAll((actor: Actor): void => {
            this.shiftBoth(actor, dx, dy);
        });
    }

    /**
     * Calls both setWidth and setHeight on An Actor.
     *
     * @param actor
     * @param width   A new width for the Actor.
     * @param height   A new height for the Actor.
     * @param updateSprite   Whether to update the Actor's canvas (by default, false).
     */
    public setSize(actor: Actor, width: number, height: number, updateSprite?: boolean): void {
        this.setWidth(actor, width, updateSprite);
        this.setHeight(actor, height, updateSprite);
    }

    /**
     * Shifts An Actor horizontally by its xvel and vertically by its yvel, using
     * shiftHoriz and shiftVert.
     *
     * @param actor
     */
    public updatePosition(actor: Actor): void {
        this.shiftHoriz(actor, actor.xvel);
        this.shiftVert(actor, actor.yvel);
    }

    /**
     * Reduces An Actor's width by pushing back its right and decreasing its
     * width. It is marked as changed in appearance.
     *
     * @param actor
     * @param dx   How much to reduce the Actor's width.
     */
    public reduceWidth(actor: Actor, dx: number): void {
        actor.right -= dx;
        actor.width -= dx;

        this.markChanged(actor);
    }

    /**
     * Reduces An Actor's height by pushing down its top and decreasing its
     * height. It is marked as changed in appearance.
     *
     * @param actor
     * @param dy   How much to reduce the Actor's height.
     */
    public reduceHeight(actor: Actor, dy: number): void {
        actor.top += dy;
        actor.height -= dy;

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor toward a target x, but limits the total distance allowed.
     * Distance is computed as from the Actor's horizontal midpoint.
     *
     * @param actor   The Actor to be shifted horizontally.
     * @param dx   How far to shift the Actor horizontally.
     * @param maxDistance   The maximum distance the Actor can be shifted (by
     *                      default, Infinity for no maximum).
     */
    public slideToX(actor: Actor, dx: number, maxDistance = Infinity): void {
        const midx = this.getMidX(actor);

        if (midx < dx) {
            this.shiftHoriz(actor, Math.min(maxDistance, dx - midx));
        } else {
            this.shiftHoriz(actor, Math.max(-maxDistance, dx - midx));
        }
    }

    /**
     * Shifts An Actor toward a target y, but limits the total distance allowed.
     * Distance is computed as from the Actor's vertical midpoint.
     *
     * @param actor   The Actor to be shifted vertically.
     * @param dy   How far to shift the Actor vertically.
     * @param maxDistance   The maximum distance the Actor can be shifted (by
     *                      default, Infinity, for no maximum).
     */
    public slideToY(actor: Actor, dy: number, maxDistance = Infinity): void {
        const midy = this.getMidY(actor);

        if (midy < dy) {
            this.shiftVert(actor, Math.min(maxDistance, dy - midy));
        } else {
            this.shiftVert(actor, Math.max(-maxDistance, dy - midy));
        }
    }

    /**
     * @param actor
     * @param other
     * @returns Whether the first Actor's vertical midpoint is to the left
     *          of the other's.
     */
    public actorAbove(actor: Actor, other: Actor): boolean {
        return this.getMidY(actor) < this.getMidY(other);
    }

    /**
     * @param actor
     * @param other
     * @returns Whether the first Actor's horizontal midpoint is to the left
     *          of the other's.
     */
    public actorToLeft(actor: Actor, other: Actor): boolean {
        return this.getMidX(actor) < this.getMidX(other);
    }

    /**
     * Shifts An Actor's top up, then sets the bottom (similar to a shiftVert and
     * a setTop combined).
     *
     * @param actor   The Actor to be shifted vertically.
     * @param dy   How far to shift the Actor vertically (by default, 0).
     */
    public updateTop(actor: Actor, dy = 0): void {
        actor.top += dy;
        actor.bottom = actor.top + actor.height;

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor's right, then sets the left (similar to a shiftHoriz and a
     * setRight combined).
     *
     * @param actor   The Actor to be shifted horizontally.
     * @param dx   How far to shift the Actor horizontally (by default, 0).
     */
    public updateRight(actor: Actor, dx = 0): void {
        actor.right += dx;
        actor.left = actor.right - actor.width;

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor's bottom down, then sets the bottom (similar to a
     * shiftVert and a setBottom combined).
     *
     * @param actor   The Actor to be shifted vertically.
     * @param dy   How far to shift the Actor vertically (by default, 0).
     */
    public updateBottom(actor: Actor, dy = 0): void {
        actor.bottom += dy;
        actor.top = actor.bottom - actor.height;

        this.markChanged(actor);
    }

    /**
     * Shifts An Actor's left, then sets the right (similar to a shiftHoriz and a
     * setLeft combined).
     *
     * @param actor   The Actor to be shifted horizontally.
     * @param dx   How far to shift the Actor horizontally (by default, 0).
     */
    public updateLeft(actor: Actor, dx = 0): void {
        actor.left += dx;
        actor.right = actor.left + actor.width;

        this.markChanged(actor);
    }
}
