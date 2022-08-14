import { Actor, Section } from "eightbittr";

import { FullScreenSaver } from "FullScreenSaver";

/**
 * Keeps track of points and high scores.
 */
export class Scoring extends Section<FullScreenSaver> {
    /**
     * Starts regularly increasing score for a player's run.
     */
    public start(player: Actor) {
        this.game.itemsHolder.setItem("score", 0);
        this.refreshDisplay();

        this.game.timeHandler.addEventInterval(
            () => {
                if (player.removed) {
                    const score = this.game.itemsHolder.getItem("score");
                    const highScore = this.game.itemsHolder.getItem("highScore");

                    if (!highScore || score > highScore) {
                        this.game.itemsHolder.setItem("highScore", score);
                        this.game.itemsHolder.saveItem("highScore");
                    }

                    this.refreshDisplay();
                    return true;
                }

                this.game.itemsHolder.increase("score", 1);
                this.refreshDisplay();
                return false;
            },
            50,
            Infinity
        );
    }

    /**
     * Creates a Score menu to handle score and high score.
     */
    public refreshDisplay() {
        const score = this.game.itemsHolder.getItem("score");
        const highScore = this.game.itemsHolder.getItem("highScore") || 0;
        this.game.menuGrapher.createMenu("Score");
        this.game.menuGrapher.addMenuDialog("Score", `SCORE ${score}\nHIGHSCORE ${highScore}`);
    }
}
