declare module ItemsHoldr {
    export interface IItemValueSettings {
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
        transformGet?: Function;
        transformSet?: Function;
    }

    export interface IItemValue {
        element: HTMLElement;
        hasElement: boolean;
        ItemsHolder: IItemsHoldr;
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
        transformGet?: Function;
        transformSet?: Function;
        storeLocally: boolean;
        getValue(): any;
        setValue(value: any): void;
        update(): void;
        checkTriggers(): void;
        checkModularity(): void;
        updateElement(): void;
        retrieveLocalStorage(): void;
        updateLocalStorage(overrideAutoSave?: boolean): void;
    }

    export interface IItemsHoldrSettings {
        prefix?: string;
        allowNewItems?: boolean;
        autoSave?: boolean;
        callbackArgs?: any[];
        localStorage?: any;
        defaults?: any;
        displayChanges?: any;
        values?: { [i: string]: any };
        doMakeContainer?: boolean;
        containersArguments?: any[][];
    }

    export interface IItemsHoldr {
        getValues(): { [i: string]: IItemValue };
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
        addItem(key: string, settings: any): IItemValue;
        removeItem(key: string): void;
        clear(): void;
        setItem(key: string, value: any): void;
        increase(key: string, amount?: number | string): void;
        decrease(key: string, amount?: number): void;
        toggle(key: string): void;
        checkExistence(key: string): void;
        saveAll(): void;
        hideContainer(): void;
        displayContainer(): void;
        makeContainer(containrs: any[][]): HTMLElement;
        hasDisplayChange(value: string): boolean;
        getDisplayChange(value: string): string;
        createElement(tag?: string, ...args: any[]): HTMLElement;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        proliferateElement(recipient: any, donor: any, noOverride?: boolean): any;
    }
}
