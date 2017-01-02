import { IItemsHoldr } from "itemsholdr/lib/IItemsHoldr";
import { ItemsHoldr } from "itemsholdr/lib/ItemsHoldr";

import {
    ICallbackRegister, IEventCallback, IEventsRegister, IMod,
    IModAttachr, IModAttachrSettings, IMods, ITransformModName
} from "./IModAttachr";

/**
 * Hookups for extensible triggered mod events.
 */
export class ModAttachr implements IModAttachr {
    /**
     * For each event, the listing of mods that attach to that event.
     */
    private readonly events: IEventsRegister = {};

    /**
     * All known mods, keyed by name.
     */
    private readonly mods: IMods = {};

    /**
     * A ItemsHoldr object that may be used to store mod status.
     */
    private readonly itemsHolder?: IItemsHoldr;

    /**
     * Transforms mod names to storage keys.
     */
    private readonly transformModName: ITransformModName;

    /**
     * Initializes a new instance of the ModAttachr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IModAttachrSettings = {}) {
        this.transformModName = settings.transformModName || ((name: string): string => name);

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
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * If the event is enabled, the "onModEnable" event for it is triggered.
     * 
     * @param mod   General schema for a mod, including its name and events.
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

        this.mods[mod.name] = mod;

        if (this.itemsHolder) {
            const storedKey: string = this.transformModName(mod.name);
            this.itemsHolder.addItem(storedKey, {
                valueDefault: false,
                storeLocally: true
            });

            if (this.itemsHolder.getItem(storedKey)) {
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
        for (const mod of mods) {
            this.addMod(mod);
        }
    }

    /**
     * Enables a mod of the given name, if it exists. The onModEnable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to enable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable event.
     */
    public enableMod(name: string, ...args: any[]): any {
        const mod: IMod = this.mods[name];
        if (!mod) {
            throw new Error(`No mod of name '${name}'.`);
        }

        mod.enabled = true;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(this.transformModName(name), true);
        }

        if (mod.events.hasOwnProperty("onModEnable")) {
            return this.fireModEvent("onModEnable", mod.name, ...args);
        }
    }

    /**
     * Enables any number of mods.
     * 
     * @param names   Names of the mods to enable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    public enableMods(...names: string[]): void {
        for (const name of names) {
            this.enableMod(name);
        }
    }

    /**
     * Disables a mod of the given name, if it exists. The onModDisable event is
     * called for the mod.
     * 
     * @param name   The name of the mod to disable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModDisable event.
     */
    public disableMod(name: string, ...args: any[]): any {
        const mod: IMod = this.retrieveMod(name);

        this.mods[name].enabled = false;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(this.transformModName(name), false);
        }

        if (mod.events.hasOwnProperty("onModDisable")) {
            return this.fireModEvent("onModDisable", mod.name, ...args);
        }
    }

    /**
     * Disables any number of mods.
     * 
     * @param names   Names of the mods to disable.
     * @returns The return values of the mods' onModEnable events, in order.
     */
    public disableMods(...names: string[]): void {
        for (const name of names) {
            this.disableMod(name);
        }
    }

    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param name   The name of the mod to toggle.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable or onModDisable event.
     */
    public toggleMod(name: string, ...args: any[]): any {
        const mod: IMod = this.retrieveMod(name);

        return mod.enabled
            ? this.disableMod(name)
            : this.enableMod(name, ...args);
    }

    /**
     * Toggles any number of mods.
     * 
     * @param names   Names of the mods to toggle.
     * @returns The result of the mods' onModEnable or onModDisable events, in order.
     */
    public toggleMods(...names: string[]): void {
        for (const name of names) {
            this.toggleMod(name);
        }
    }

    /**
     * Fires an event, which calls all mods listed for that event.
     * 
     * @param name   Name of the event to fire.
     * @param args   Any additional arguments to pass to event callbacks.
     */
    public fireEvent(name: string, ...args: any[]): void {
        const mods: IMod[] = this.events[name];
        if (!mods) {
            return;
        }

        for (const mod of mods) {
            if (mod.enabled) {
                this.retrieveModEvent(mod, name)(...args);
            }
        }
    }

    /**
     * Fires an event specifically for one mod, rather than all mods containing
     * that event.
     * 
     * @param eventName   Name of the event to fire.
     * @param modName   Name of the mod to fire the event.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the fired mod event.
     */
    public fireModEvent(eventName: string, modName: string, ...args: any[]): any {
        const mod: IMod = this.retrieveMod(modName);
        const eventCallback: IEventCallback = this.retrieveModEvent(mod, eventName);

        return eventCallback(...args);
    }

    /**
     * Retrieves a mod, or throws if it doesn't exist.
     * 
     * @param name   Name of a mod.
     * @returns   The mod under the name.
     */
    private retrieveMod(name: string): IMod {
        const mod: IMod = this.mods[name];

        if (!mod) {
            throw new Error(`Unknown mod requested: '${name}'.`);
        }

        return mod;
    }

    /**
     * Retrieves a mod's event, or throws if it doesn't exist.
     * 
     * @param name   Name of a mod.
     * @param event   Name of an event under the mod.
     * @returns   The mod's event.
     */
    private retrieveModEvent(mod: IMod, name: string): IEventCallback {
        const eventCallback: IEventCallback | undefined = mod.events[name];

        if (!eventCallback) {
            throw new Error(`Mod does not contain event '${name}'.`);
        }

        return eventCallback;
    }
}
