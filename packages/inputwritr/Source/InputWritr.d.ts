declare module InputWritr {
    export interface IInputWritrTriggerCallback {
        (eventInformation: any, event: Event): void;
    }

    export interface IInputWritrTriggerContainer {
        [i: string]: {
            [i: string]: IInputWritrTriggerCallback;
            [i: number]: IInputWritrTriggerCallback;
        }
    }

    export interface IInputWriterBooleanGetter {
        (...args: any[]): boolean;
    }

    export interface IInputWritrSettings {
        /**
         * The mapping of events to their key codes, to their callbacks.
         */
        triggers: IInputWritrTriggerContainer;

        /**
         * The first argument to be passed to event callbacks.
         */
        eventInformation?: any;

        /**
         * Function to generate a current timestamp, commonly performance.now.
         */
        getTimestamp?: () => number;

        /**
         * Known, allowed aliases for triggers.
         */
        aliases?: { [i: string]: any[] };
        
        /**
         * A quick lookup table of key aliases to their character codes.
         */
        keyAliasesToCodes?: { [i: string]: number };
        
        /**
         * A quick lookup table of character codes to their key aliases.
         */
        keyCodesToAliases?: { [i: number]: string };

        /**
         * Whether events are initially allowed to trigger (by default, true).
         */
        canTrigger?: boolean | IInputWriterBooleanGetter;

        /**
         * Whether triggered inputs are initially allowed to be written to history
         * (by default, true).
         */
        isRecording?: boolean | IInputWriterBooleanGetter;
    }

    export interface IInputWritr {
        restartHistory(keepHistory?: boolean): void;
        getAliases(): any;
        getAliasesAsKeyStrings(): { [i: string]: any };
        getAliasAsKeyStrings(alias: any): string[];
        convertAliasToKeyString(alias: any): string;
        convertKeyStringToAlias(key: number | string): number | string;
        getHistory(name?: string): any;
        getHistories(): any;
        getCanTrigger(): IInputWriterBooleanGetter;
        getIsRecording(): IInputWriterBooleanGetter;
        setCanTrigger(canTriggerNew: boolean | IInputWriterBooleanGetter): void;
        setIsRecording(isRecordingNew: boolean | IInputWriterBooleanGetter): void;
        setEventInformation(eventInformationNew: any): void;
        addAliasValues(name: any, values: any[]): void;
        removeAliasValues(name: string, values: any[]): void;
        switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;
        addAliases(aliasesRaw: any): void;
        addEvent(trigger: string, label: any, callback: IInputWritrTriggerCallback): void;
        removeEvent(trigger: string, label: any): void;
        saveHistory(name?: string): void;
        playHistory(): void;
        playEvents(events: any): void;
        callEvent(event: Function | string, keycode?: number, sourceEvent?: Event): any;
        makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): Function;
    }
}
