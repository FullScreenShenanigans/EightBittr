import { EightBittr } from "../EightBittr";
import { Actor } from "../types";
import { Section } from "./Section";

/**
 * TODO EXPLAIN
 *
 * @returns Whether to remove the Actor from its group.
 */
export type ActorMaintainer = (actor: Actor) => boolean | undefined;

/**
 * Update logic for Actors in game ticks.
 */
export class Maintenance<Game extends EightBittr> extends Section<Game> {
    /**
     * Group type names along with their tick maintenance functions.
     */
    public readonly maintainers: [string, ActorMaintainer][] = [];

    /**
     * Maintains and prunes a group of Actors for a game tick.
     *
     * @param actors   Group of Actors in order.
     * @param maintainer   Function to run on non-removed actors.
     */
    public maintainGroup(actors: Actor[], maintainer: ActorMaintainer) {
        for (let i = 0; i < actors.length; i += 1) {
            const actor = actors[i];

            if (actor.removed || maintainer(actor)) {
                this.game.utilities.arrayDeleteActor(actor, actors, i);
                i -= 1;
            }
        }
    }
}
