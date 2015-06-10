declare module StatsHoldr {
    export interface IStatsValueSettings {
        value?: any;
        valueDefault?: any;
        hasElement?: boolean;
        elementTag?: string;
        storeLocally?: boolean;
        triggers?: any;
        modularity?: number;
        onModular?: any;
        digits?: number;
        minimum?: number;
        onMinimum?: any;
        maximum?: number;
        onMaximum?: number;
    }

    export interface IStatsValue {
        value: any;
        element: HTMLElement;
        hasElement: boolean;
        StatsHolder: IStatsHoldr;
        key: string;
        valueDefault: any;
        elementTag: string;
        minimum: number;
        maximum: number;
        modularity: number;
        triggers: any;
        onModular: Function;
        onMinimum: Function;
        onMaximum: Function;
        storeLocally: boolean;
        update(): void;
        checkTriggers(): void;
        checkModularity(): void;
        updateElement(): void;
        retrieveLocalStorage(): void;
        updateLocalStorage(overrideAutoSave?: boolean): void;
    }

    export interface IStatsHoldrSettings {
        prefix?: string;
        allowNewItems?: boolean;
        autoSave?: boolean;
        callbackArgs?: any[];
        localStorage?: any;
        defaults?: any;
        displayChanges?: any;
        values?: { [i: string]: any };
        doMakeContainer?: boolean;
        containersArguments?: any[][]
    }

    export interface IStatsHoldr {
        getValues(): { [i: string]: IStatsValue };
        getDefaults(): any;
        getLocalStorage(): Storage;
        getAutoSave(): boolean;
        getPrefix(): string;
        getContainer(): HTMLElement;
        getContainersArguments(): any[][];
        getDisplayChanges(): any;
        getCallbackArgs(): any[];
        getKeys(): string[];
        getItem(key: string): any;
        getObject(key: string): any;
        hasKey(key: string): boolean;
        exportItems(): any;
        addItem(key: string, settings: any): IStatsValue;
        setItem(key: string, value: any): void;
        increase(key: string, amount?: number | string): void;
    }
}