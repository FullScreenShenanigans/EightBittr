import { Actor, Collisions as CollisionsBase } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Checkers and callbacks for Actor collisions.
 */
export class Collisions<Game extends FullScreenSaver> extends CollisionsBase<Game> {
    /**
     * Names of groups that should be checked for collisions.
     */
    public readonly collidingGroupNames = ["Players"];

    /**
     * Function generators for checking whether two Actors are colliding.
     */
    public readonly hitCheckGenerators = {
        Players: {
            Squares: () => (player: Actor, solid: Actor) =>
                player.right >= solid.left &&
                player.left <= solid.right &&
                player.bottom >= solid.top &&
                player.top <= solid.bottom,
        },
    };

    /**
     * Function generators for reacting to two Actors colliding.
     */
    public readonly hitCallbackGenerators = {
        Players: {
            Squares: () => (player: Actor) => {
                this.game.death.kill(player);

                for (const square of this.game.groupHolder.getGroup("Squares").slice(1)) {
                    this.game.death.kill(square);
                }
            },
        },
    };
}
