import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";

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
export interface IEventCallback {
    (...args: any[]): any;
}

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
export interface ITransformModName {
    (name: string): string;
}

/**
 * Settings to initialize a new IModAttachr.
 */
export interface IModAttachrSettings {
    /**
     * Mods to be immediately added via addMod.
     */
    mods?: IMod[];

    /**
     * A ItemsHoldr to store mod status locally.
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
}

/**
 * Hookups for extensible triggered mod events.
 */
export interface IModAttachr {
    /**
     * @returns An Object keying each mod by their name.
     */
    getMods(): IMods;

    /**
     * @param name   The name of the mod to return.
     * @returns The mod keyed by the name.
     */
    getMod(name: string): IMod;

    /**
     * @returns An Object keying each event by their name.
     */
    getEvents(): IEventsRegister;

    /**
     * @returns The mods associated with a particular event.
     */
    getEvent(name: string): IMod[];

    /**
     * @returns The ItemsHoldr if storeLocally is true (by default, undefined).
     */
    getItemsHolder(): IItemsHoldr | undefined;

    /**
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * If the event is enabled, the "onModEnable" event for it is triggered.
     * 
     * @param mod   General schema for a mod, including its name and events.
     */
    addMod(mod: IMod): any;

    /**
     * Adds multiple mods via this.addMod.
     * 
     * @param mods   The mods to add.
     */
    addMods(...mods: IMod[]): void;

    /**
     * Enables a mod of the given name, if it exists. The onModEnable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to enable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable event.
     */
    enableMod(name: string, ...args: any[]): any;

    /**
     * Enables any number of mods.
     * 
     * @param names   Names of the mods to enable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    enableMods(...names: string[]): void;

    /**
     * Disables a mod of the given name, if it exists. The onModDisable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to disable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModDisable event.
     */
    disableMod(name: string, ...args: any[]): any;

    /**
     * Disables any number of mods.
     * 
     * @param names   Names of the mods to disable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    disableMods(...names: string[]): void;

    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param name   The name of the mod to toggle.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable or onModDisable event.
     */
    toggleMod(name: string, ...args: any[]): any;

    /**
     * Toggles any number of mods.
     * 
     * @param names   Names of the mods to toggle.
     * @returns The result of the mods' onModEnable or onModDisable events, in order.
     */
    toggleMods(...names: string[]): void;

    /**
     * Fires an event, which calls all mods listed for that event.
     * 
     * @param name   Name of the event to fire.
     * @param args   Any additional arguments to pass to event callbacks.
     */
    fireEvent(name: string, ...args: any[]): void;

    /**
     * Fires an event specifically for one mod, rather than all mods containing
     * that event.
     * 
     * @param eventName   Name of the event to fire.
     * @param modName   Name of the mod to fire the event.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the fired mod event.
     */
    fireModEvent(eventName: string, modName: string, ...args: any[]): any;
}
