import { GameStartr } from "../GameStartr";
import { GeneralComponent } from "./GeneralComponent";
import { ModEventNames } from "./mods/EventNames";

/**
 * Holds event names for mods.
 */
export class Mods<TGameStartr extends GameStartr> extends GeneralComponent<TGameStartr> {
    /**
     * Event names for mods.
     */
    public readonly eventNames = new ModEventNames();
}
