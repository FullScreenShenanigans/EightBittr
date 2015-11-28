declare module ModAttachr {
    export interface IModAttachrMod {
        // The user-readable name of the mod.
        name: string;

        // The mapping of events to callback Functions to be evaluated.
        events: { [i: string]: IModEvent };

        // The scope to call event Functions from, if necessary.
        scope?: any;

        // Whether the mod is currently enabled (by default, false).
        enabled?: boolean;
    }

    interface IModEvent {
        (...args: any[]): any;
    }

    export interface IModAttachrSettings {
        /**
         * Mods to be immediately added via addMod.
         */
        mods?: any[];

        /**
         * A ItemsHoldr to store mod status locally.
         */
        ItemsHoldr?: ItemsHoldr.IItemsHoldr;

        /**
         * Whether there should be a ItemsHoldr created if one isn't given.
         */
        storeLocally?: boolean;

        /**
         * A default scope to apply mod events from, if not the ModAttachr.
         */
        scopeDefault?: any;
    }

    export interface IModAttachr {
        getMods(): any;
        getMod(name: string): IModAttachrMod;
        getEvents(): any;
        getEvent(name: string): IModAttachrMod[];
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        addMod(mod: IModAttachrMod): void;
        addMods(mods: IModAttachrMod[]): void;
        enableMod(name: string): void;
        enableMods(...names: string[]): void;
        disableMod(name: string): void;
        disableMods(...names: string[]): void;
        toggleMod(name: string): void;
        toggleMods(...names: string[]): void;
        fireEvent(event: string, ...extraArgs: any[]): void;
        fireModEvent(eventName: string, modName: string, ...extraArgs: any[]): any;
    }
}
