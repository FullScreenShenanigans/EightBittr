import { IItemsHoldr } from "itemsholdr";

import { EventNames, IEventNames } from "./EventNames";

import {
    ICallbackRegister, IEventCallback, IEventsRegister, IMod,
    IModAttachr, IModAttachrSettings, IMods, ITransformModName,
} from "./IModAttachr";

/**
 * Retrieves a mod's event, or throws if it doesn't exist.
 *
 * @param eventName   Name of a mod.
 * @param event   Name of an event under the mod.
 * @returns   The mod's event.
 */
export const retrieveModEvent = (mod: IMod, eventName: string): IEventCallback => {
    const eventCallback = mod.events[eventName];
    if (eventCallback === undefined) {
        throw new Error(`Mod '${mod.name}' does not contain event '${eventName}'.`);
    }

    return eventCallback;
};

/**
 * Hookups for extensible triggered mod events.
 */
export class ModAttachr implements IModAttachr {
    /**
     * Holds keys for mod events.
     */
    private readonly eventNames: IEventNames;

    /**
     * All known mods, keyed by name.
     */
    private readonly mods: IMods = {};

    /**
     * For each event, the listing of mods that attach to that event.
     */
    private readonly events: IEventsRegister = {};

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
        this.eventNames = settings.eventNames === undefined
            ? new EventNames()
            : settings.eventNames;
        this.transformModName = settings.transformModName === undefined
            ? ((modName: string): string => modName)
            : settings.transformModName;

        this.itemsHolder = settings.itemsHolder;

        if (settings.mods !== undefined) {
            for (const mod of settings.mods) {
                this.addMod(mod);
            }
        }
    }

    /**
     * Enables a mod.
     *
     * @param modName   Name of a mod to enable.
     */
    public enableMod(modName: string): void {
        const mod: IMod = this.retrieveMod(modName);
        if (mod.enabled === true) {
            return;
        }

        mod.enabled = true;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(this.transformModName(modName), true);
        }

        if (mod.events[this.eventNames.onModEnable] !== undefined) {
            this.fireModEvent(this.eventNames.onModEnable, mod.name);
        }
    }

    /**
     * Disables a mod.
     *
     * @param modName   Name of a mod to disable.
     */
    public disableMod(modName: string): void {
        const mod: IMod = this.retrieveMod(modName);
        if (mod.enabled !== true) {
            return;
        }

        mod.enabled = false;

        if (this.itemsHolder) {
            this.itemsHolder.setItem(this.transformModName(modName), false);
        }

        if (mod.events[this.eventNames.onModDisable] !== undefined) {
            this.fireModEvent(this.eventNames.onModDisable, mod.name);
        }
    }

    /**
     * Fires an event, which calls all callbacks of mods listed for that event.
     *
     * @param eventName   Name of the event to fire.
     * @param args   Any additional arguments to pass to event callbacks.
     */
    public fireEvent(eventName: string, ...args: any[]): void {
        if (!{}.hasOwnProperty.call(this.events, eventName)) {
            return;
        }

        const mods: IMod[] = this.events[eventName];

        for (const mod of mods) {
            if (mod.enabled === true) {
                retrieveModEvent(mod, eventName)(...args);
            }
        }
    }

    /**
     * Adds a mod to the pool of mods.
     *
     * @param mod   General schema for a mod, including its name and events.
     */
    private addMod(mod: IMod): void {
        const modEvents: ICallbackRegister = mod.events;

        for (const eventName in modEvents) {
            if (!modEvents.hasOwnProperty(eventName)) {
                continue;
            }

            if (!this.events.hasOwnProperty(eventName)) {
                this.events[eventName] = [mod];
            } else {
                this.events[eventName].push(mod);
            }
        }

        this.mods[mod.name] = mod;

        if (this.itemsHolder !== undefined) {
            const storedKey: string = this.transformModName(mod.name);
            this.itemsHolder.addItem(storedKey, {
                valueDefault: Boolean(mod.enabled),
            });

            if (this.itemsHolder.getItem(storedKey)) {
                this.enableMod(mod.name);
            }
        } else if (mod.enabled === true) {
            this.enableMod(mod.name);
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
    private fireModEvent(eventName: string, modName: string, ...args: any[]): void {
        const mod: IMod = this.retrieveMod(modName);
        const eventCallback: IEventCallback = retrieveModEvent(mod, eventName);

        eventCallback(...args);
    }

    /**
     * Retrieves a mod, or throws if it doesn't exist.
     *
     * @param name   Name of a mod.
     * @returns   The mod under the name.
     */
    private retrieveMod(modName: string): IMod {
        if (!{}.hasOwnProperty.call(this.mods, modName)) {
            throw new Error(`Unknown mod requested: '${modName}'.`);
        }

        return this.mods[modName];
    }
}
