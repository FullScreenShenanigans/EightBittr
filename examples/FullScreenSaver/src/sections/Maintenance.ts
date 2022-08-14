import { Actor, ActorMaintainer, Maintenance as MaintenanceBase } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Update logic for Actors in game ticks.
 */
export class Maintenance<Game extends FullScreenSaver> extends MaintenanceBase<Game> {
    /**
     * Maintains a general Actor for a tick.
     */
    public readonly maintain = (actor: Actor) => {
        this.game.physics.shiftBoth(actor, actor.xVelocity, actor.yVelocity);

        if (actor.top < 0) {
            actor.yVelocity *= -1;
            this.game.physics.setTop(actor, -actor.top);
        }

        if (actor.bottom > this.game.mapScreener.height) {
            actor.yVelocity *= -1;
            this.game.physics.shiftVertical(actor, this.game.mapScreener.height - actor.bottom);
        }

        if (actor.left < 0) {
            actor.xVelocity *= -1;
            this.game.physics.setLeft(actor, -actor.left);
        }

        if (actor.right > this.game.mapScreener.width) {
            actor.xVelocity *= -1;
            this.game.physics.shiftHorizontal(actor, this.game.mapScreener.width - actor.right);
        }

        return undefined;
    };

    public readonly maintainers: [string, ActorMaintainer][] = [
        ["Squares", this.maintain],
        ["Players", this.maintain],
    ];
}
