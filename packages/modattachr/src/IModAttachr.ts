import { IItemsHoldr } from "itemsholdr";

import { EventNames } from "./EventNames";

/**
 * General schema for a mod, including its name and events.
 */
export interface IMod {
    /**
     * The user-readable name of the mod.
     */
    name: string;

    /**
     * The mapping of events to callback Functions to be evaluated.
     */
    events: ICallbackRegister;

    /**
     * Whether the mod is currently enabled (by default, false).
     */
    enabled?: boolean;
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
     * Mods to be immediately added via addMod.
     */
    mods?: IMod[];

    /**
     * Cache-based wrapper around localStorage.
     */
    itemsHolder?: IItemsHoldr;

    /**
     * Whether there should be a ItemsHoldr created if one isn't given.
     */
    storeLocally?: boolean;

    /**
     * Transforms mod names to storage keys.
     */
    transformModName?: ITransformModName;

    /**
     * Holds keys for mod events.
     */
    eventNames?: EventNames;
}

/**
 * Hookups for extensible triggered mod events.
 */
export interface IModAttachr {
    /**
     * Holds keys for mod events.
     */
    readonly eventNames: EventNames;

    /**
     * All known mods, keyed by name.
     */
    readonly mods: IMods;

    /**
     * Adds a mod to the pool of mods.
     *
     * @param mod   General schema for a mod, including its name and events.
     */
    addMod(mod: IMod): any;

    /**
     * Enables a mod.
     *
     * @param name   The name of the mod to enable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable event, if it exists.
     */
    enableMod(name: string, ...args: any[]): any;

    /**
     * Disables a mod.
     *
     * @param name   The name of the mod to disable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModDisable event, if it exists.
     */
    disableMod(name: string, ...args: any[]): any;

    /**
     * Toggles a mod via enableMod/disableMod.
     *
     * @param name   The name of the mod to toggle.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable or onModDisable event.
     */
    toggleMod(name: string, ...args: any[]): any;

    /**
     * Fires an event, which calls all mods listed for that event.
     *
     * @param name   Name of the event to fire.
     * @param args   Any additional arguments to pass to event callbacks.
     */
    fireEvent(name: string, ...args: any[]): void;

    /**
     * Fires an event for one mod.
     *
     * @param eventName   Name of the event to fire.
     * @param modName   Name of the mod to fire the event.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the fired mod event.
     */
    fireModEvent(eventName: string, modName: string, ...args: any[]): any;
}
