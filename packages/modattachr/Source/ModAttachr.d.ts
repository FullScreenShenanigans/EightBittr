declare module ModAttachr {
    /**
     * General schema for a mod, including its name, events with callbacks, 
     * scope, and whether it's enabled.
     */
    export interface IModAttachrMod {
        /**
         * The user-readable name of the mod.
         */
        name: string;

        /**
         * The mapping of events to callback Functions to be evaluated.
         */
        events: IModEvents;

        /**
         * The scope to call event Functions from, if necessary.
         */
        scope?: any;

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
    interface IModEvent {
        (...args: any[]): any;
    }

    /**
     * Listing of events, keying event names to all mods attached to them.
     */
    export interface IModAttachrEvents {
        [i: string]: IModAttachrMod[];
    }

    /**
     * Listing of mods, keyed by name.
     */
    export interface IModAttachrMods {
        [i: string]: IModAttachrMod;
    }

    /**
     * Listing of events attached to a mod, keyed by trigger name.
     */
    export interface IModEvents {
        [i: string]: IModEvent;
    }

    /**
     * Settings to initialize a new IModAttachr.
     */
    export interface IModAttachrSettings {
        /**
         * Mods to be immediately added via addMod.
         */
        mods?: IModAttachrMod[];

        /**
         * A ItemsHoldr to store mod status locally.
         */
        ItemsHoldr?: ItemsHoldr.IItemsHoldr;

        /**
         * Whether there should be a ItemsHoldr created if one isn't given.
         */
        storeLocally?: boolean;

        /**
         * A default scope to apply mod events from, if not the IModAttachr.
         */
        scopeDefault?: any;
    }
    
    /**
     * An addon for for extensible modding functionality. "Mods" register triggers
     * such as "onModEnable" or "onReset" that can be triggered during gameplay.
     */
    export interface IModAttachr {
        /**
         * @returns An Object keying each mod by their name.
         */
        getMods(): IModAttachrMods;

        /**
         * @param name   The name of the mod to return.
         * @returns The mod keyed by the name.
         */
        getMod(name: string): IModAttachrMod;

        /**
         * @returns An Object keying each event by their name.
         */
        getEvents(): IModAttachrEvents;

        /**
         * @returns The mods associated with a particular event.
         */
        getEvent(name: string): IModAttachrMod[];

        /**
         * @returns The ItemsHoldr if storeLocally is true (by default, undefined).
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;

        /**
         * @returns The default scope used to apply mods from, if not this ModAttachr.
         */
        getScopeDefault(): any;


        /* Alterations 
        */

        /**
         * Adds a mod to the pool of mods, listing it under all the relevant events.
         * If the event is enabled, the "onModEnable" event for it is triggered.
         * 
         * @param mod   A summary Object for a mod, containing at the very
         *              least a name and listing of events.
         */
        addMod(mod: IModAttachrMod): any;

        /**
         * Adds multiple mods via this.addMod.
         * 
         * @param mods   The mods to add.
         * @returns The return values of the mods' onModEnable events, in order.
         */
        addMods(...mods: IModAttachrMod[]): any[];

        /**
         * Enables a mod of the given name, if it exists. The onModEnable event is
         * called for the mod.
         * 
         * @param name   The name of the mod to enable.
         * @param args   Any additional arguments to pass. This will have `mod`
         *               and `name` unshifted in front, in that order.
         */
        enableMod(name: string, ...args: any[]): any;

        /**
         * Enables any number of mods.
         * 
         * @param names   Names of the mods to enable.
         * @returns The return values of the mods' onModEnable events, in order.
         */
        enableMods(...names: string[]): any[];

        /**
         * Disables a mod of the given name, if it exists. The onModDisable event is
         * called for the mod.
         * 
         * @param name   The name of the mod to disable.
         * @returns The return value of the mod's onModDisable event.
         */
        disableMod(name: string): any;

        /**
         * Disables any number of mods.
         * 
         * @param names   Names of the mods to disable.
         */
        disableMods(...names: string[]): any[];

        /**
         * Toggles a mod via enableMod/disableMod of the given name, if it exists.
         * 
         * @param name   The name of the mod to toggle.
         * @returns The result of the mod's onModEnable or onModDisable event.
         */
        toggleMod(name: string): any;

        /**
         * Toggles any number of mods.
         * 
         * @param names   Names of the mods to toggle.
         * @returns The result of the mods' onModEnable or onModDisable events, in order.
         */
        toggleMods(...names: string[]): any[];

        /**
         * Fires an event, which calls all mods listed for that event.
         * 
         * @param event   The name of the event to fire.
         * @param args   Any additional arguments to pass. This will have `mod`
         *               and `event` unshifted in front, in that order.
         */
        fireEvent(event: string, ...args: any[]): void;

        /**
         * Fires an event specifically for one mod, rather than all mods containing
         * that event.
         * 
         * @param event   The name of the event to fire.
         * @param modName   The name of the mod to fire the event.
         * @param args   Any additional arguments to pass. This will have `mod`
         *               and `event` unshifted in front, in that order.
         * @returns The result of the fired mod event.
         */
        fireModEvent(event: string, modName: string, ...args: any[]): any;
    }
}
