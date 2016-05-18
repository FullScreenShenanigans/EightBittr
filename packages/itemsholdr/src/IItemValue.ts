/**
 * A mapping of ItemValue values to triggered callbacks.
 */
export interface ITriggers {
    [i: string]: Function;
    [j: number]: Function;
}

/**
 * A container of default values to pass to IItemValues, keyed by the
 * IItemValue keys.m
 */
export interface IItemValueDefaults {
    [i: string]: IItemValueSettings;
}

/**
 * Settings to initialize a new instance of the IItemValue interface.
 */
export interface IItemValueSettings {
    /**
     * An initial value to store.
     */
    value?: any;

    /**
     * A default initial value to store, if value isn't provided.
     */
    valueDefault?: any;

    /**
     * Whether the value should be stored in the IItemHoldr's localStorage.
     */
    storeLocally?: boolean;

    /**
     * A mapping of values to callbacks that should be triggered when value
     * is equal to them.
     */
    triggers?: ITriggers;

    /**
     * Whether an Element should be created and synced to the value.
     */
    hasElement?: boolean;

    /**
     * An Element tag to use in creating the element, if hasElement is true.
     */
    elementTag?: string;

    /**
     * A minimum value for the value to equal, if value is a number.
     */
    minimum?: number;

    /**
     * A callback to call when the value reaches the minimum value.
     */
    onMinimum?: Function;

    /**
     * A maximum value for the value to equal, if value is a number.
     */
    maximum?: number;

    /**
     * A callback to call when the value reaches the maximum value.
     */
    onMaximum?: Function;

    /**
     * A maximum number to modulo the value against, if value is a number.
     */
    modularity?: number;

    /**
     * A callback to call when the value reaches modularity.
     */
    onModular?: Function;

    /**
     * A Function to transform the value when it's being set.
     */
    transformGet?: Function;

    /**
     * A Function to transform the value when it's being retrieved.
     */
    transformSet?: Function;
}

/**
 * Storage container for a single IItemsHoldr value. The value may have triggers
 * assigned to value, modularity, and other triggers, as well as an HTML element.
 */
export interface IItemValue {
    /**
     * @returns The value being stored, with a transformGet applied if one exists.
     */
    getValue(): any;

    /**
     * Sets the value being stored, with a is a transformSet applied if one exists.
     * Any attached triggers to the new value will be called.
     *
     * @param value   The desired value to now store.
     */
    setValue(value: any): void;

    /**
     * @returns The stored HTML element, if it exists.
     */
    getElement(): HTMLElement;

    /**
     * General update Function to be run whenever the internal value is changed.
     * It runs all the trigger, modular, etc. checks, updates the HTML element
     * if there is one, and updates localStorage if needed.
     */
    update(): void;

    /**
     * Stores a ItemValue's value in localStorage under the prefix plus its key.
     * 
     * @param overrideAutoSave   Whether the policy on saving should be ignored
     *                           so saving happens regardless. By default, false.
     */
    updateLocalStorage(overrideAutoSave?: boolean): void;
}
