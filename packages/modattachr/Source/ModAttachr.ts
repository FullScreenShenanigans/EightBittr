/// <reference path="StatsHoldr/StatsHoldr.ts" />

interface IModAttachrSettings {
    // The mods to be immediately added via addMod.
    mods?: any[];

    // Whether a new StatsHoldr should be created to store mod settings.
    storeLocally?: boolean;

    // Settings to use for a new StatsHoldr, if storeLocally is true.
    storageSettings?: IStatsHoldrSettings;

    // A default scope to apply mod events from when a mod doesn't provide one.
    scopeDefault?: any;
}

interface IModAttachrMod {
    // The user-readable name of the mod.
    name: string;

    // The mapping of events to callback Functions to be evaluated.
    events: any;

    // The scope to call event Functions from, if necessary.
    scope?: any;

    // Whether the mod is currently enabled (by default, false).
    enabled?: boolean;
}

/**
 * ModAttachr.js
 * 
 * An addon for for extensible modding functionality. "Mods" register triggers
 * such as "onModEnable" or "onReset" that can be triggered.
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class ModAttachr {
    // An Object of the mods with a listing for each event
    // by event names (e.g. "onReset" => [{Mod1}, {Mod2}].
    private events: any;

    // An Object of information on each mod, keyed by mod names
    // (e.g. { "MyMod": { "name": "MyMod", "enabled": 1, ...} ...}).
    private mods: any;

    // A new StatsHolder object to be created to store whether each
    // mod is stored locally (optional).
    private StatsHolder: StatsHoldr;

    // A default scope to apply mod events from (optional).
    private scopeDefault: any;

    /**
     * Resets the ModAttachr.
     * 
     * @constructor
     * @param {IModAttachrSettings} [settings]
     */
    constructor(settings: IModAttachrSettings) {
        this.mods = {};
        this.events = {};

        if (settings) {
            this.scopeDefault = settings.scopeDefault;

            if (settings.storeLocally) {
                this.StatsHolder = new StatsHoldr(settings.storageSettings);
            }

            if (settings.mods) {
                this.addMods(settings.mods);
            }
        }
    }


    /* Simple gets 
    */

    /**
     * @return {Object} An Object keying each mod by their name.
     */
    getMods(): any {
        return this.mods;
    }

    /**
     * @param {String} name   The name of the mod to return.
     * @return {Object} The mod keyed by the name.
     */
    getMod(name: string): IModAttachrMod {
        return this.mods[name];
    }

    /**
     * @return {Object} An Object keying each event by their name.
     */
    getEvents(): any {
        return this.events;
    }

    /**
     * @return {Object[]} The mods associated with a particular event.
     */
    getEvent(name: string): IModAttachrMod[] {
        return this.events[name];
    }

    /**
     * @return {StatsHoldr} The StatsHoldr if storeLocally is true, or undefined
     *                      otherwise.
     */
    getStatsHolder(): StatsHoldr {
        return this.StatsHolder;
    }


    /* Alterations 
    */

    /**
     * Adds a mod to the pool of mods, listing it under all the relevant events.
     * If the event is enabled, the "onModEnable" event for it is triggered.
     * 
     * @param {Object} mod   A summary Object for a mod, containing at the very
     *                       least a name and Object of events.
     */
    addMod(mod: IModAttachrMod): void {
        var modEvents: any = mod.events,
            name: string;

        for (name in modEvents) {
            if (!modEvents.hasOwnProperty(name)) {
                continue;
            }

            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = [mod];
            } else {
                this.events[name].push(mod);
            }
        }

        // Mod scope defaults to the ModAttacher's scopeDefault.
        mod.scope = mod.scope || this.scopeDefault;

        // Record the mod in the ModAttachr's mods listing.
        this.mods[mod.name] = mod;

        // If the mod is enabled, trigger its "onModEnable" event
        if (mod.enabled && mod.events.onModEnable) {
            this.fireModEvent("onModEnable", mod.name, arguments);
        }

        // If there's a StatsHoldr, record the mod in it
        if (this.StatsHolder) {
            this.StatsHolder.addStatistic(mod.name, {
                "valueDefault": 0,
                "storeLocally": true
            });

            // If there was already a (true) value, immediately enable the mod
            if (this.StatsHolder.get(mod.name)) {
                this.enableMod(mod.name);
            }
        }
    }

    /**
     * Adds each mod in a given Array.
     * 
     * @param {Array} mods
     */
    addMods(mods: IModAttachrMod[]): void {
        for (var i: number = 0; i < mods.length; i += 1) {
            this.addMod(mods[i]);
        }
    }

    /**
     * Enables a mod of the given name, if it exists. The onModEnable event is
     * called for the mod.
     * 
     * @param {String} name   The name of the mod to enable.
     */
    enableMod(name: string): any {
        var mod: IModAttachrMod = this.mods[name],
            args: any[];

        if (!mod) {
            throw new Error("No mod of name: '" + name + "'");
        }

        mod.enabled = true;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;

        if (this.StatsHolder) {
            this.StatsHolder.set(name, true);
        }

        if (mod.events.onModEnable) {
            return this.fireModEvent("onModEnable", mod.name, arguments);
        }
    }

    /**
     * Enables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {...String} names
     */
    enableMods(...names: string[]): void {
        names.forEach(this.enableMod.bind(this));
    }

    /**
     * Disables a mod of the given name, if it exists. The onModDisable event is
     * called for the mod.
     * 
     * @param {String} name   The name of the mod to disable.
     */
    disableMod(name: string): any {
        var mod: IModAttachrMod = this.mods[name],
            args: any[];

        if (!this.mods[name]) {
            throw new Error("No mod of name: '" + name + "'");
        }

        this.mods[name].enabled = false;
        args = Array.prototype.slice.call(arguments);
        args[0] = mod;

        if (this.StatsHolder) {
            this.StatsHolder.set(name, false);
        }

        if (mod.events.onModDisable) {
            return this.fireModEvent("onModDisable", mod.name, args);
        }
    }

    /**
     * Disables any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {...String} names 
     */
    disableMods(...names: string[]): void {
        names.forEach(this.disableMod.bind(this));
    }

    /**
     * Toggles a mod via enableMod/disableMod of the given name, if it exists.
     * 
     * @param {String} name   The name of the mod to toggle.
     */
    toggleMod(name: string): void {
        var mod: IModAttachrMod = this.mods[name];

        if (!mod) {
            throw new Error("No mod found under " + name);
        }

        if (mod.enabled) {
            return this.disableMod(name);
        } else {
            return this.enableMod(name);
        }
    }

    /**
     * Toggles any number of mods, given as any number of Strings or Arrays of
     * Strings.
     * 
     * @param {...String} names
     */
    toggleMods(...names: string[]): void {
        names.forEach(this.toggleMod.bind(this));
    }


    /* Actions
    */

    /**
     * Fires an event, which calls all functions listed undder mods for that 
     * event. Any number of arguments may be given.
     * 
     * @param {String} event   The name of the event to fire.
     */
    fireEvent(event: string): void {
        var fires: any[] = this.events[event],
            args: any[] = Array.prototype.splice.call(arguments, 0),
            mod: IModAttachrMod,
            i: number;

        // If no triggers were defined for this event, that's ok: just stop.
        if (!fires) {
            return;
        }

        for (i = 0; i < fires.length; i += 1) {
            mod = fires[i];
            args[0] = mod;
            if (mod.enabled) {
                mod.events[event].apply(mod.scope, args);
            }
        }
    }

    /**
     * Fires an event specifically for one mod, rather than all mods containing
     * that event.
     * 
     * @param {String} eventName   The name of the event to fire.
     * @param {String} modName   The name of the mod to fire the event.
     */
    fireModEvent(eventName: string, modName: string, ...extraArgs: any[]): void {
        var mod: IModAttachrMod = this.mods[modName],
            args: any[] = Array.prototype.slice.call(arguments, 2),
            fires: any;

        if (!mod) {
            throw new Error("Unknown mod requested: '" + modName + "'");
        }

        args[0] = mod;
        fires = mod.events[eventName];

        if (!fires) {
            throw new Error("Mod does not contain event: '" + eventName + "'");
        }

        return fires.apply(mod.scope, args);
    }
}
