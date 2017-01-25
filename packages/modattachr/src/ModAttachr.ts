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
     * Cache-based wrapper around localStorage.
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
            for (const mod of settings.mods) {
                this.addMod(mod);
            }
        }
    }

    /**
     * Adds a mod to the pool of mods.
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
     * Enables a mod of the given name, if it exists.
     * 
     * @param name   The name of the mod to enable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable event, if it exists.
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
     * Disables a mod.
     * 
     * @param name   The name of the mod to disable.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModDisable event, if it exists.
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
     * Toggles a mod via enableMod/disableMod.
     * 
     * @param name   The name of the mod to toggle.
     * @param args   Any additional arguments to pass to event callbacks.
     * @returns The result of the mod's onModEnable or onModDisable event.
     */
    public toggleMod(name: string, ...args: any[]): any {
        const mod: IMod = this.retrieveMod(name);

        return mod.enabled
            ? this.disableMod(name, ...args)
            : this.enableMod(name, ...args);
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
     * Fires an event for one mod.
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
