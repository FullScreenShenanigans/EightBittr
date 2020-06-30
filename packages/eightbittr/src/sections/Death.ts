import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

import { Section } from "./Section";

/**
 * Removes Things from the game.
 */
export class Death<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Generically kills a Thing by removing it from the game.
     */
    public kill(thing: IThing): void {
        thing.alive = false;
        this.game.groupHolder.removeFromGroup(thing, thing.groupType);
    }
}
