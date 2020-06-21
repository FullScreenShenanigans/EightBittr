/// <reference path="../typings/EightBittr.d.ts" />

import { IThing } from "./IGameStartr";
import { GameStartr } from "./GameStartr";

/**
 * Scrolling functions used by GameStartr instances.
 */
export class Physics<TIEightBittr extends GameStartr> extends EightBittr.Physics<TIEightBittr> {
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
     * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
     * to redraw the Thing and its quadrant.
     * 
     * @param thing
     */
    public markChanged(thing: IThing): void {
        thing.changed = true;
    }

    /**
     * Shifts a Thing vertically using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param thing
     * @param dy   How far to shift the Thing vertically.
     * @param notChanged   Whether to skip marking the Thing as changed (by 
     *                     default, false).
     */
    public shiftVert(thing: IThing, dy: number, notChanged?: boolean): void {
        super.shiftVert(thing, dy);

        if (!notChanged) {
            this.markChanged(thing);
        }
    }

    /**
     * Shifts a Thing horizontally using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param thing
     * @param dx   How far to shift the Thing horizontally.
     * @param notChanged   Whether to skip marking the Thing as changed (by
     *                     default, false).
     */
    public shiftHoriz(thing: IThing, dx: number, notChanged?: boolean): void {
        super.shiftHoriz(thing, dx);

        if (!notChanged) {
            this.markChanged(thing);
        }
    }

    /**
     * Sets a Thing's top using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param thing
     * @param top   A new top border for the Thing.
     */
    public setTop(thing: IThing, top: number): void {
        super.setTop(thing, top);
        this.markChanged(thing);
    }

    /**
     * Sets a Thing's right using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param thing
     * @param right   A new right border for the Thing.
     */
    public setRight(thing: IThing, right: number): void {
        super.setRight(thing, right);
        this.markChanged(thing);
    }

    /**
     * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param thing
     * @param bottom   A new bottom border for the Thing.
     */
    public setBottom(thing: IThing, bottom: number): void {
        super.setBottom(thing, bottom);
        this.markChanged(thing);
    }

    /**
     * Sets a Thing's left using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param thing
     * @param left   A new left border for the Thing.
     */
    public setLeft(thing: IThing, left: number): void {
        super.setLeft(thing, left);
        this.markChanged(thing);
    }

    /**
     * Shifts a thing both horizontally and vertically. If the Thing marks 
     * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
     * proportion of movement is respected (.5 = half, etc.).
     * 
     * @param thing
     * @param dx   How far to shift the Thing horizontally.
     * @param dy   How far to shift the Thing vertically.
     * @param notChanged   Whether to skip marking the Thing as changed (by 
     *                     default, false).
     */
    public shiftBoth(thing: IThing, dx: number, dy: number, notChanged?: boolean): void {
        dx = dx || 0;
        dy = dy || 0;

        if (!thing.noshiftx) {
            if (thing.parallaxHoriz) {
                this.shiftHoriz(thing, thing.parallaxHoriz * dx, notChanged);
            } else {
                this.shiftHoriz(thing, dx, notChanged);
            }
        }

        if (!thing.noshifty) {
            if (thing.parallaxVert) {
                this.shiftVert(thing, thing.parallaxVert * dy, notChanged);
            } else {
                this.shiftVert(thing, dy, notChanged);
            }
        }
    }

    /**
     * Calls shiftBoth on all members of an Array.
     * 
     * @param dx   How far to shift the Things horizontally.
     * @param dy   How far to shift the Things vertically.
     * @param notChanged   Whether to skip marking the Things as changed (by 
     *                     default, false).
     */
    public shiftThings(things: IThing[], dx: number, dy: number, notChanged?: boolean): void {
        for (const thing of things) {
            this.shiftBoth(thing, dx, dy, notChanged);
        }
    }

    /**
     * Calls shiftBoth on all groups in the calling GameStartr's GroupHoldr.
     * 
     * @param dx   How far to shift the Things horizontally.
     * @param dy   How far to shift the Things vertically.
     */
    public shiftAll(dx: number, dy: number): void {
        this.EightBitter.GroupHolder.callAll(this, this.shiftThings, dx, dy, true);
    }

    /**
     * Sets the width and unitwidth of a Thing, and optionally updates the
     * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param thing
     * @param width   A new width for the Thing.
     * @param updateSprite   Whether to update the Thing's spritewidth and 
     *                       spritewidthpixels (by default, false).
     * @param updateSize   Whether to call updateSize on the Thing (by 
     *                     default, false).
     */
    public setWidth(thing: IThing, width: number, updateSprite?: boolean, updateSize?: boolean): void {
        thing.width = width;
        thing.unitwidth = width * this.EightBitter.unitsize;

        if (updateSprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * this.EightBitter.unitsize;
        }

        if (updateSize) {
            this.updateSize(thing);
        }

        this.markChanged(thing);
    }

    /**
     * Sets the height and unitheight of a Thing, and optionally updates the
     * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param thing
     * @param height   A new height for the Thing.
     * @param updateSprite   Whether to update the Thing's spriteheight and
     *                       spriteheightpixels (by default, false).
     * @param updateSize   Whether to call updateSize on the Thing (by 
     *                     default, false).
     */
    public setHeight(thing: IThing, height: number, updateSprite?: boolean, updateSize?: boolean): void {
        thing.height = height;
        thing.unitheight = height * this.EightBitter.unitsize;

        if (updateSprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * this.EightBitter.unitsize;
        }

        if (updateSize) {
            this.updateSize(thing);
        }

        this.markChanged(thing);
    }

    /**
     * Utility to call both setWidth and setHeight on a Thing.
     * 
     * @param thing
     * @param width   A new width for the Thing.
     * @param height   A new height for the Thing.
     * @param updateSprite   Whether to update the Thing's spritewidth,
     *                       spriteheight, spritewidthpixels, and
     *                       spritspriteheightpixels (by default, false).
     * @param updateSize   Whether to call updateSize on the Thing (by 
     *                     default, false).
     */
    public setSize(thing: IThing, width: number, height: number, updateSprite?: boolean, updateSize?: boolean): void {
        this.setWidth(thing, width, updateSprite, updateSize);
        this.setHeight(thing, height, updateSprite, updateSize);
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
     * Completely updates the size measurements of a Thing. That means the
     * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
     * spriteheightpixels attributes. The Thing's sprite is then updated by the
     * PixelDrawer, and its appearance is marked as changed.
     * 
     * @param thing
     */
    public updateSize(thing: IThing): void {
        thing.unitwidth = thing.width * this.EightBitter.unitsize;
        thing.unitheight = thing.height * this.EightBitter.unitsize;
        thing.spritewidthpixels = thing.spritewidth * this.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * this.EightBitter.unitsize;

        thing.canvas.width = thing.spritewidthpixels;
        thing.canvas.height = thing.spriteheightpixels;
        this.EightBitter.PixelDrawer.setThingSprite(thing);

        this.markChanged(thing);
    }

    /**
     * Reduces a Thing's width by pushing back its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param thing
     * @param dx   How much to reduce the Thing's width.
     * @param updateSize   Whether to also call updateSize on the Thing
     *                     (by default, false).
     */
    public reduceWidth(thing: IThing, dx: number, updateSize?: boolean): void {
        thing.right -= dx;
        thing.width -= dx / this.EightBitter.unitsize;

        if (updateSize) {
            this.updateSize(thing);
        } else {
            this.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param thing
     * @param dy   How much to reduce the Thing's height.
     * @param updateSize   Whether to also call updateSize on the Thing
     *                     (by default, false).
     */
    public reduceHeight(thing: IThing, dy: number, updateSize?: boolean): void {
        thing.top += dy;
        thing.height -= dy / this.EightBitter.unitsize;

        if (updateSize) {
            this.updateSize(thing);
        } else {
            this.markChanged(thing);
        }
    }

    /**
     * Increases a Thing's width by pushing forward its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param thing
     * @param dx   How much to increase the Thing's width.
     * @param updateSize   Whether to also call updateSize on the Thing 
     *                     (by default, false).
     */
    public increaseWidth(thing: IThing, dx: number, updateSize?: boolean): void {
        thing.right += dx;
        thing.width += dx / this.EightBitter.unitsize;
        thing.unitwidth = thing.width * this.EightBitter.unitsize;

        if (updateSize) {
            this.updateSize(thing);
        } else {
            this.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param thing
     * @param dy   How much to increase the Thing's height.
     * @param updateSize   Whether to also call updateSize on the Thing 
     *                     (by default, false).
     */
    public increaseHeight(thing: IThing, dy: number, updateSize?: boolean): void {
        thing.top -= dy;
        thing.height += dy / this.EightBitter.unitsize;
        thing.unitheight = thing.height * this.EightBitter.unitsize;

        if (updateSize) {
            this.updateSize(thing);
        } else {
            this.markChanged(thing);
        }
    }
}
