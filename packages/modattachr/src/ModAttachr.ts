import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";
import { ItemsHoldr } from "itemsholdr/lib/ItemsHoldr";

import {
    ICallbackRegister, IEventCallback, IEventsRegister, IMod, IModAttachr, IModAttachrSettings, IMods
} from "./IModAttachr";

/**
 * Hookups for extensible triggered mod events.
 */
export class ModAttachr implements IModAttachr {
    /**
     * For each event, the listing of mods that attach to that event.
     */
    private events: IEventsRegister;

    /**
     * All known mods, keyed by name.
     */
    private mods: IMods;

    /**
     * A ItemsHoldr object that may be used to store mod status.
     */
    private itemsHolder?: IItemsHoldr;

    /**
     * A default scope to apply mod events from, if not this ModAttachr.
     */
    private scopeDefault: any;

    /**
     * Initializes a new instance of the ModAttachr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    constructor(settings?: IModAttachrSettings) {
        this.mods = {};
        this.events = {};

        if (!settings) {
            return;
        }

        this.scopeDefault = settings.scopeDefault;

        if (settings.itemsHolder) {
            this.itemsHolder = settings.itemsHolder;
        } else if (settings.storeLocally) {
            this.itemsHolder = new ItemsHoldr();
        }

        if (settings.mods) {
            this.addMods(...settings.mods);
        }
    }

    /**
     * @returns An Object keying each mod by their name.
     */
    public getMods(): IMods {
        return this.mods;
    }

    /**
     * @param name   The name of the mod to return.
     * @returns The mod keyed by the name.
     */
    public getMod(name: string): IMod {
        return this.mods[name];
    }

    /**
     * @returns An Object keying each event by their name.
     */
    public getEvents(): IEventsRegister {
        return this.events;
    }

    /**
     * @returns The mods associated with a particular event.
     */
    public getEvent(name: string): IMod[] {
        return this.events[name];
    }

    /**
     * @returns The ItemsHoldr if storeLocally is true (by default, undefined).
     */
    public getItemsHolder(): IItemsHoldr | undefined {
        return this.itemsHolder;
    }

    /**
     * @returns The default scope used to apply mods from, if not this ModAttachr.
     */
    public getScopeDefault(): any {
        return this.scopeDefault;
    }

    /**
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * If the event is enabled, the "onModEnable" event for it is triggered.
     * 
     * @param mod   A summary Object for a mod, containing at the very
     *              least a name and listing of events.
     */
    public addMod(mod: IMod): void {
        const modEvents: ICallbackRegister = mod.events;

        for (const name in modEvents) {
            if (!modEvents.hasOwnProperty(name)) {
                continue;
            }

            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = [mod];
            } else {
                this.events[name].push(mod);
            }
        }

        mod.scope = mod.scope || this.scopeDefault;
        this.mods[mod.name] = mod;

        if (this.itemsHolder) {
            this.itemsHolder.addItem(mod.name, {
                "valueDefault": 0,
                "storeLocally": true
            });

            if (this.itemsHolder.getItem(mod.name)) {
                this.enableMod(mod.name);
            }
        }
    }

    /**
     * Adds multiple mods via this.addMod.
     * 
     * @param mods   The mods to add.
     */
    public addMods(...mods: IMod[]): void {
        for (let i: number = 0; i < mods.length; i += 1) {
            this.addMod(mods[i]);
        }
    }

    /**
     * Enables a mod of the given name, if it exists. The onModEnable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to enable.
     * @param args   Any additional arguments to pass. This will have `mod`
     *               and `name` unshifted in front, in that order.
     */
    public enableMod(name: string, ...args: any[]): void {
        const mod: IMod = this.mods[name];

        if (!mod) {
            throw new Error(`No mod of name '${name}'.`);
        }

        // The args are manually sliced to prevent external state changes
        args = [].slice.call(args);
        args.unshift(mod, name);
        mod.enabled = true;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(name, true);
        }

        if (mod.events.hasOwnProperty("onModEnable")) {
            this.fireModEvent("onModEnable", mod.name, arguments);
        }
    }

    /**
     * Enables any number of mods.
     * 
     * @param names   Names of the mods to enable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    public enableMods(...names: string[]): void {
        for (let i: number = 0; i < names.length; i += 1) {
            this.enableMod(names[i]);
        }
    }

    /**
     * Disables a mod of the given name, if it exists. The onModDisable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to disable.
     */
    public disableMod(name: string): void {
        const mod: IMod = this.mods[name];

        if (!this.mods[name]) {
            throw new Error("No mod of name: '" + name + "'");
        }

        this.mods[name].enabled = false;

        const args: any = [].slice.call(arguments);
        args[0] = mod;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(name, false);
        }

        if (mod.events.hasOwnProperty("onModDisable")) {
            return this.fireModEvent("onModDisable", mod.name, args);
        }
    }

    /**
     * Disables any number of mods.
     * 
     * @param names   Names of the mods to disable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    public disableMods(...names: string[]): void {
        for (let i: number = 0; i < names.length; i += 1) {
            this.disableMod(names[i]);
        }
    }

    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param name   The name of the mod to toggle.
     * @param args   Any additional arguments to pass. This will have `mod`
     *               and `name` unshifted in front, in that order.
     * @returns The result of the mod's onModEnable or onModDisable event.
     */
    public toggleMod(name: string, ...args: any[]): void {
        const mod: IMod = this.mods[name];

        if (!mod) {
            throw new Error("No mod found under " + name);
        }

        if (mod.enabled) {
            return this.disableMod(name);
        } else {
            return this.enableMod(name, args);
        }
    }

    /**
     * Toggles any number of mods.
     * 
     * @param names   Names of the mods to toggle.
     * @returns The result of the mods' onModEnable or onModDisable events, in order.
     */
    public toggleMods(...names: string[]): void {
        for (let i: number = 0; i < names.length; i += 1) {
            this.toggleMod(names[i]);
        }
    }

    /**
     * Fires an event, which calls all mods listed for that event.
     * 
     * @param event   The name of the event to fire.
     * @param args   Any additional arguments to pass. This will have `mod`
     *               and `event` unshifted in front, in that order.
     */
    public fireEvent(event: string, ...args: any[]): void {
        const mods: IMod[] = this.events[event];

        // If no triggers were defined for this event, that's ok: just stop.
        if (!mods) {
            return;
        }

        // The args are manually sliced to prevent external state changes
        args = [].slice.call(args);
        args.unshift(undefined, event);

        for (let i: number = 0; i < mods.length; i += 1) {
            const mod: IMod = mods[i];

            if (mod.enabled) {
                args[0] = mod;
                mod.events[event].apply(mod.scope, args);
            }
        }
    }

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
    public fireModEvent(event: string, modName: string, ...args: any[]): any {
        const mod: IMod = this.mods[modName];

        if (!mod) {
            throw new Error(`Unknown mod requested: '${modName}'.`);
        }

        // The args are manually sliced to prevent external state changes
        args = [].slice.call(args);
        args.unshift(mod, event);
        const eventCallback: IEventCallback = mod.events[event];

        if (!eventCallback) {
            throw new Error(`Mod does not contain event '${event}'.`);
        }

        return eventCallback.apply(mod.scope, args);
    }
}
