import { EventNames as ModAttachrEventNames } from "modattachr";

/**
 * Holds event names for mods.
 */
export class ModEventNames extends ModAttachrEventNames {
    /*
     * Key for the event when the game is starting to play.
     */
    public readonly onGamePlay = "onGamePlay";

    /**
     * Key for the event when the game is paused.
     */
    public readonly onGamePause = "onGamePause";
}
