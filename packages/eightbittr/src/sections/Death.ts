import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

import { Section } from "./Section";

/**
 * Removes Actors from the game.
 */
export class Death<Game extends EightBittr> extends Section<Game> {
    /**
     * Generically kills a Actor by removing it from the game.
     */
    public kill(actor: Actor): void {
        actor.hidden = actor.removed = true;
        this.game.groupHolder.removeFromGroup(actor, actor.groupType);
    }
}
