import { EightBittr } from "../../EightBittr";
import { Actor } from "../../types";
import { Section } from "../Section";

/**
 * Changes the opacity of Actors.
 */
export class Opacity<Game extends EightBittr> extends Section<Game> {
    /**
     * Sets the opacity of the Actor and marks its appearance as changed.
     *
     * @param actor
     * @param opacity   A number in [0,1].
     */
    public setOpacity(actor: Actor, opacity: number): void {
        actor.opacity = opacity;
        actor.changed = true;
    }
}
