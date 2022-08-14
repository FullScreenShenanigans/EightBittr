import { GameWindow, Inputs as InputsBase } from "eightbittr";
import { TriggerContainer } from "inputwritr";

import { Direction } from "../Direction";
import { FullScreenSaver } from "../FullScreenSaver";

/**
 * User input filtering and handling.
 */
export class Inputs<Game extends FullScreenSaver> extends InputsBase<Game> {
    /**
     * Known, allowed aliases for input event triggers.
     */
    public readonly aliases = {
        bottom: [40],
        left: [37],
        right: [39],
        top: [38],
    };

    /**
     * Mapping of events to their key codes, to their callbacks.
     */
    public readonly triggers: TriggerContainer = {
        onkeydown: {
            bottom: (event) => {
                event?.preventDefault();
                this.game.players.requestPlayer(Direction.Bottom);
            },
            left: (event) => {
                event?.preventDefault();
                this.game.players.requestPlayer(Direction.Left);
            },
            right: (event) => {
                event?.preventDefault();
                this.game.players.requestPlayer(Direction.Right);
            },
            top: (event) => {
                event?.preventDefault();
                this.game.players.requestPlayer(Direction.Top);
            },
        },
    };

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    public initializeGlobalPipes(gameWindow: GameWindow) {
        super.initializeGlobalPipes(gameWindow);

        gameWindow.addEventListener(
            "keydown",
            this.game.inputWriter.makePipe("onkeydown", "keyCode")
        );
    }
}
