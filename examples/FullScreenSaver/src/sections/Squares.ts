import { Actor, Section } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Creates square Actors in the game.
 */
export class Squares extends Section<FullScreenSaver> {
    /**
     * Maximum number of squares to stop spawning after.
     */
    private readonly maximumSquares =
        Math.sqrt((this.game.mapScreener.height * this.game.mapScreener.width) / 2000) | 0;

    /**
     * Creates a new square in the game.
     */
    public addSquare(midX: number, midY: number, xVelocity: number, yVelocity: number) {
        const square = this.game.actors.add(["Square", { xVelocity, yVelocity }]);

        this.game.physics.setMid(square, midX, midY);
    }

    /**
     * Starts spawning new squares while it still can.
     */
    public readonly startAddingSquares = (player: Actor) => {
        this.game.timeHandler.addEventInterval(
            () => {
                if (player.removed) {
                    return true;
                }

                const solids = [...this.game.groupHolder.getGroup("Squares")];

                for (const square of solids) {
                    if (solids.length >= this.maximumSquares) {
                        return true;
                    }

                    this.addSquare(
                        this.game.physics.getMidX(square),
                        this.game.physics.getMidY(square),
                        -square.xVelocity * 0.75,
                        -square.yVelocity * 0.75
                    );
                }

                return false;
            },
            150,
            Infinity
        );
    };
}
