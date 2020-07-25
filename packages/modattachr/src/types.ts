import { ItemsHoldr } from "itemsholdr";

import { EventNames } from "./EventNames";

/**
 * General schema for a mod, including its name and events.
 */
export interface Mod {
    /**
     * Whether the mod is immediately enabled (by default, false).
     */
    enabled?: boolean;

    /**
     * Event callbacks, keyed by event name.
     */
    events: CallbackRegister;

    /**
     * User-readable name of the mod.
     */
    name: string;
}

/**
 * Abstrack callback Function for any mod event.
 *
 * @param args   The arguments for the mod event.
 * @returns The result of the mod (normally ignored).
 */
export type EventCallback = (...args: any[]) => any;

/**
 * Listing of events, keying event names to all mods attached to them.
 */
export interface EventsRegister {
    [i: string]: Mod[];
}

/**
 * Listing of mods, keyed by name.
 */
export interface Mods {
    [i: string]: Mod;
}

/**
 * Listing of events attached to a mod, keyed by trigger name.
 */
export interface CallbackRegister {
    /**
     * Callback to disable the mod.
     */
    onModDisable?: EventCallback;

    /**
     * Callback to enable the mod.
     */
    onModEnable?: EventCallback;

    [i: string]: EventCallback | undefined;
}

/**
 * Cache-based wrapper around localStorage for mods.
 */
export type ModsItemsHoldr = Pick<ItemsHoldr, "addItem" | "getItem" | "setItem">;

/**
 * Transforms mod names to storage keys.
 *
 * @param name   Name of a mod.
 * @returns What the mod will be called in storage.
 */
export type TransformModName = (name: string) => string;

/**
 * Settings to initialize a new ModAttachr.
 */
export interface ModAttachrSettings {
    /**
     * Event names for mods.
     */
    eventNames?: EventNames;

    /**
     * Mods that may be enabled or disabled.
     */
    mods?: Mod[];

    /**
     * Cache-based wrapper around localStorage for mods.
     */
    itemsHolder?: ModsItemsHoldr;

    /**
     * Transforms mod names to storage keys.
     */
    transformModName?: TransformModName;
}
