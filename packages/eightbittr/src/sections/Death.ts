import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

import { Section } from "./Section";

/**
 * Removes Things from the game.
 */
export class Death<TEightBittr extends EightBittr> extends Section<TEightBittr> {
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
}
