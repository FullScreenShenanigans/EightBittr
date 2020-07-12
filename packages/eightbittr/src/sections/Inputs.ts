import { IAliases, ITriggerContainer, ICanTrigger } from "inputwritr";

import { Section } from "./Section";
import { EightBittr } from "../EightBittr";
import { IGameWindow } from "../types";

/**
 * User input filtering and handling.
 */
export class Inputs<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Known, allowed aliases for input event triggers.
     */
    public readonly aliases?: IAliases;

    /**
     * Whether input events are allowed to trigger (by default, true).
     */
    public readonly canInputsTrigger: boolean | ICanTrigger = true;

    /**
     * Mapping of events to their key codes, to their callbacks.
     */
    public readonly triggers?: ITriggerContainer;

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    public initializeGlobalPipes(gameWindow: IGameWindow) {
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
