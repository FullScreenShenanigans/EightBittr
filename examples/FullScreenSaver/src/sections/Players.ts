import { Section } from "eightbittr";

import { Direction } from "../Direction";
import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Raw speed player velocities will be based off of.
 */
const speed = 5;

/**
 * Horizontal and vertical player speeds for each possible direction.
 */
const directionVelocities = {
    [Direction.Top]: {
        xVelocity: 0,
        yVelocity: -speed,
    },
    [Direction.Right]: {
        xVelocity: speed,
        yVelocity: 0,
    },
    [Direction.Bottom]: {
        xVelocity: 0,
        yVelocity: speed,
    },
    [Direction.Left]: {
        xVelocity: -speed,
        yVelocity: 0,
    },
};

/**
 * Creates and updates player Actors.
 */
export class Players extends Section<FullScreenSaver> {
    /**
     * Creates a new Player, if there wasn't one already.
     */
    public requestPlayer(direction: Direction) {
        const existingPlayer = this.game.groupHolder.getActor("player1");
        const velocities = directionVelocities[direction];

        if (existingPlayer) {
            Object.assign(existingPlayer, velocities);
            return;
        }

        const square = this.game.groupHolder.getGroup("Squares")[0];

        const newPlayer = this.game.actors.add([
            "Player",
            {
                id: "player1",
                ...directionVelocities[direction],
            },
        ]);

        this.game.physics.setMidObj(newPlayer, square);
        this.game.physics.shiftBoth(
            newPlayer,
            (newPlayer.xVelocity * square.width + 1) / speed,
            (newPlayer.yVelocity * square.width + 1) / speed
        );

        this.game.squares.startAddingSquares(newPlayer);
        this.game.scoring.start(newPlayer);
    }
}
