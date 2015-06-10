declare module ModAttachr {
    export interface IModAttachrSettings {
        // The mods to be immediately added via addMod.
        mods?: any[];

        // Whether a new StatsHoldr should be created to store mod settings.
        storeLocally?: boolean;

        // Settings to use for a new StatsHoldr, if storeLocally is true.
        StatsHoldr?: StatsHoldr.IStatsHoldr;

        // A default scope to apply mod events from when a mod doesn't provide one.
        scopeDefault?: any;
    }

    export interface IModAttachrMod {
        // The user-readable name of the mod.
        name: string;

        // The mapping of events to callback Functions to be evaluated.
        events: any;

        // The scope to call event Functions from, if necessary.
        scope?: any;

        // Whether the mod is currently enabled (by default, false).
        enabled?: boolean;
    }

    export interface IModAttachr {
        getMods(): any;
        getMod(name: string): IModAttachrMod;
        getEvents(): any;
        getEvent(name: string): IModAttachrMod[];
        getStatsHolder(): StatsHoldr.IStatsHoldr;
        addMod(mod: IModAttachrMod): void;
        addMods(mods: IModAttachrMod[]): void;
        enableMod(name: string): void;
        enableMods(...names: string[]): void;
        disableMod(name: string): void;
        disableMods(...names: string[]): void;
        toggleMod(name: string): void;
        toggleMods(...names: string[]): void;
        fireEvent(event: string): void;
        fireModEvent(eventName: string, modName: string, ...extraArgs: any[]): void;
    }
}