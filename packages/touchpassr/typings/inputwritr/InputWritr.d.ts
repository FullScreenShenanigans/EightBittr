declare module "IInputWritr" {
    export interface ITriggerCallback {
        (eventInformation: any, event: Event): void;
    }
    export interface ITriggerContainer {
        [i: string]: {
            [i: string]: ITriggerCallback;
            [i: number]: ITriggerCallback;
        };
    }
    export interface IBooleanGetter {
        (...args: any[]): boolean;
    }
    export interface IAliases {
        [i: string]: any[];
    }
    export interface IAliasesToCodes {
        [i: string]: number;
    }
    export interface ICodesToAliases {
        [i: number]: string;
    }
    export interface IAliasKeys {
        [i: string]: string[];
    }
    export interface IHistory {
        [i: number]: [string, any];
    }
    export interface IHistories {
        [i: string]: IHistory;
    }
    export interface IInputWritrSettings {
        triggers: ITriggerContainer;
        eventInformation?: any;
        getTimestamp?: () => number;
        aliases?: {
            [i: string]: any[];
        };
        keyAliasesToCodes?: {
            [i: string]: number;
        };
        keyCodesToAliases?: {
            [i: number]: string;
        };
        canTrigger?: boolean | IBooleanGetter;
        isRecording?: boolean | IBooleanGetter;
    }
    export interface IInputWritr {
        getAliases(): any;
        getAliasesAsKeyStrings(): IAliasKeys;
        getAliasAsKeyStrings(alias: any): string[];
        convertAliasToKeyString(alias: any): string;
        convertKeyStringToAlias(key: number | string): number | string;
        getHistory(name?: string): any;
        getHistories(): any;
        getCanTrigger(): IBooleanGetter;
        getIsRecording(): IBooleanGetter;
        setCanTrigger(canTriggerNew: boolean | IBooleanGetter): void;
        setIsRecording(isRecordingNew: boolean | IBooleanGetter): void;
        setEventInformation(eventInformationNew: any): void;
        addAliasValues(name: any, values: any[]): void;
        removeAliasValues(name: string, values: any[]): void;
        switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;
        addAliases(aliasesRaw: any): void;
        addEvent(trigger: string, label: any, callback: ITriggerCallback): void;
        removeEvent(trigger: string, label: any): void;
        saveHistory(name?: string): void;
        restartHistory(keepHistory?: boolean): void;
        playHistory(history: IHistory): void;
        callEvent(event: Function | string, keyCode?: number | string, sourceEvent?: Event): any;
        makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): Function;
    }
}
declare module "InputWritr" {
    import { IAliases, IAliasKeys, IBooleanGetter, IHistories, IHistory, IInputWritr, IInputWritrSettings, ITriggerCallback } from "IInputWritr";
    export class InputWritr implements IInputWritr {
        private triggers;
        private aliases;
        private currentHistory;
        private histories;
        private getTimestamp;
        private startingTime;
        private eventInformation;
        private canTrigger;
        private isRecording;
        private keyAliasesToCodes;
        private keyCodesToAliases;
        constructor(settings: IInputWritrSettings);
        getAliases(): IAliases;
        getAliasesAsKeyStrings(): IAliasKeys;
        getAliasAsKeyStrings(alias: string): string[];
        convertAliasToKeyString(alias: any): string;
        convertKeyStringToAlias(key: number | string): number | string;
        getCurrentHistory(): IHistory;
        getHistory(name: string): IHistory;
        getHistories(): IHistories;
        getCanTrigger(): IBooleanGetter;
        getIsRecording(): IBooleanGetter;
        setCanTrigger(canTriggerNew: boolean | IBooleanGetter): void;
        setIsRecording(isRecordingNew: boolean | IBooleanGetter): void;
        setEventInformation(eventInformationNew: any): void;
        addAliasValues(name: any, values: any[]): void;
        removeAliasValues(name: string, values: any[]): void;
        switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;
        addAliases(aliasesRaw: any): void;
        addEvent(trigger: string, label: any, callback: ITriggerCallback): void;
        removeEvent(trigger: string, label: any): void;
        saveHistory(name?: string): void;
        restartHistory(keepHistory?: boolean): void;
        playHistory(history: IHistory): void;
        callEvent(event: Function | string, keyCode?: number | string, sourceEvent?: Event): any;
        makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): Function;
        private makeEventCall(info);
        private saveEventInformation(info);
    }
}
