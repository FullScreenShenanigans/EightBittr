import { IMod } from "modattachr";

import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";
import { ModEventNames } from "./mods/EventNames";

/**
 * Holds event names for mods.
 */
export class Mods<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * Event names for mods.
     */
    public readonly eventNames = new ModEventNames();

    /**
     * General schemas for known mods, including names and events.
     */
    public readonly mods?: IMod[];
}
