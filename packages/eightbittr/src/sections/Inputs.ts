import { IAliases, ITriggerContainer, ICanTrigger } from "inputwritr";

import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

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
}
