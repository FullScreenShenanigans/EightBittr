import { Aliases, CanTrigger, TriggerContainer } from "inputwritr";

import { EightBittr } from "../EightBittr";
import { GameWindow } from "../types";
import { Section } from "./Section";

/**
 * User input filtering and handling.
 */
export class Inputs<Game extends EightBittr> extends Section<Game> {
    /**
     * Known, allowed aliases for input event triggers.
     */
    public readonly aliases?: Aliases;

    /**
     * Whether input events are allowed to trigger (by default, true).
     */
    public readonly canInputsTrigger: boolean | CanTrigger = true;

    /**
     * Mapping of events to their key codes, to their callbacks.
     */
    public readonly triggers?: TriggerContainer;

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    public initializeGlobalPipes(gameWindow: GameWindow) {
        gameWindow.document.addEventListener("visibilitychange", () => {
            switch (document.visibilityState) {
                case "hidden":
                    this.game.frameTicker.pause();
                    return;

                case "visible":
                    this.game.frameTicker.play();
                    return;
            }
        });
    }
}
