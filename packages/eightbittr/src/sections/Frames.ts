import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * How to advance each frame of the game.
 */
export class Frames<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * How many milliseconds should be between each game tick.
     */
    public readonly interval?: number;

    /**
     * Function run at the start of each frame of the game.
     */
    public update() {
        this.game.timeHandler.advance();
        this.game.quadsKeeper.clearAllQuadrants();

        for (const group of this.game.groups.groupNames) {
            this.game.quadsKeeper.determineGroupQuadrants(this.game.groupHolder.getGroup(group));
        }
    }

    public redraw() {
        this.game.pixelDrawer.refillGlobalCanvas();
    }
}
