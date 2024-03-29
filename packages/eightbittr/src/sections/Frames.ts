/* eslint-disable @typescript-eslint/no-unsafe-argument */
// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { FrameEvents } from "frametickr";

import { EightBittr } from "../EightBittr";
import { Section } from "./Section";

/**
 * How to advance each frame of the game.
 */
export class Frames<Game extends EightBittr> extends Section<Game> {
    /**
     * Event hooks for running or state changes.
     */
    public readonly events?: FrameEvents;

    /**
     * How many milliseconds should be between each game tick.
     */
    public readonly interval = 1000 / 60;

    // 1. Any scheduled TimeHandlr events are fired
    public advance() {
        this.game.timeHandler.advance();
    }

    // 2. Groups are updated for velocities and pruned.
    public maintain() {
        for (const [groupName, maintainer] of this.game.maintenance.maintainers) {
            this.game.maintenance.maintainGroup(
                this.game.groupHolder.getGroup(groupName),
                maintainer
            );
        }
    }

    // 3. Actors in each Quadrant are recalculated for their new positions
    public setQuadrants() {
        this.game.quadsKeeper.clearAllQuadrants();
        for (const groupName of this.game.quadrants.activeGroupNames) {
            this.game.quadsKeeper.determineGroupQuadrants(
                this.game.groupHolder.getGroup(groupName)
            );
        }
    }

    // 4. Collision detection is run with the fresh Quadrant data
    public runCollisions() {
        for (const groupName of this.game.collisions.collidingGroupNames) {
            for (const actor of this.game.groupHolder.getGroup(groupName)) {
                this.game.actorHitter.checkHitsForActor(actor);
            }
        }
    }

    // 5. Updated visuals are drawn to the canvas
    public updateCanvas() {
        this.game.pixelDrawer.refillGlobalCanvas();
    }
}
