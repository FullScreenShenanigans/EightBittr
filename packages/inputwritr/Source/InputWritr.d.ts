declare module InputWritr {
    export interface IInputWritrSettings {
        // The mapping of events to their key codes to their callbacks.
        triggers: IInputWritrTriggerContainer;

        // The first argument to be passed to event callbacks.
        eventInformation?: any;

        // A Function to return the current time as a Number. If not provided, all 
        // variations of performance.now are tried; if they don't exist, Date.now
        // is used.
        getTimestamp?: () => number;

        // Known, allowed aliases for triggers.
        aliases?: { [i: string]: any[] };
        
        // A quick lookup table of key aliases to their character codes.
        keyAliasesToCodes?: { [i: string]: number };
        
        // A quick lookup table of character codes to their key aliases.
        keyCodesToAliases?: { [i: number]: string };

        // Whether events are initially allowed to trigger (by default, true).
        canTrigger?: boolean | IInputWriterBooleanGetter;

        // Whether triggered inputs are initally allowed to be written to history
        // (by default, true).
        isRecording?: boolean | IInputWriterBooleanGetter;
    }

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
    }
}