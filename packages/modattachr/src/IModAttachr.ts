import { IItemsHoldr } from "itemsholdr";

import { IEventNames } from "./EventNames";

/**
 * General schema for a mod, including its name and events.
 */
export interface IMod {
    /**
     * Whether the mod is immediately enabled (by default, false).
     */
    enabled?: boolean;

    /**
     * Event callbacks, keyed by event name.
     */
    events: ICallbackRegister;

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
export type IEventCallback = (...args: any[]) => any;

/**
 * Listing of events, keying event names to all mods attached to them.
 */
export interface IEventsRegister {
    [i: string]: IMod[];
}

/**
 * Listing of mods, keyed by name.
 */
export interface IMods {
    [i: string]: IMod;
}

/**
 * Listing of events attached to a mod, keyed by trigger name.
 */
export interface ICallbackRegister {
    /**
     * Callback to disable the mod.
     */
    onModDisable?: IEventCallback;

    /**
     * Callback to enable the mod.
     */
    onModEnable?: IEventCallback;

    [i: string]: IEventCallback | undefined;
}

/**
 * Transforms mod names to storage keys.
 *
 * @param name   Name of a mod.
 * @returns What the mod will be called in storage.
 */
export type ITransformModName = (name: string) => string;

/**
 * Settings to initialize a new IModAttachr.
 */
export interface IModAttachrSettings {
    /**
     * Event names for mods.
     */
    eventNames?: IEventNames;

    /**
     * Mods that may be enabled or disabled.
     */
    mods?: IMod[];

    /**
     * Cache-based wrapper around localStorage.
     */
    itemsHolder?: IItemsHoldr;

    /**
     * Transforms mod names to storage keys.
     */
    transformModName?: ITransformModName;
}

/**
 * Hookups for extensible triggered mod events.
 */
export interface IModAttachr {
    /**
     * Enables a mod.
     *
     * @param modName   Name of a mod to enable.
     */
    enableMod(modName: string): void;

    /**
     * Disables a mod.
     *
     * @param modName   Name of a mod to disable.
     */
    disableMod(modName: string): void;

    /**
     * Fires an event, which calls all callbacks of mods listed for that event.
     *
     * @param eventName   Name of an event to fire.
     * @param args   Any additional arguments to pass to event callbacks.
     */
    fireEvent(eventName: string, ...args: any[]): void;
}
