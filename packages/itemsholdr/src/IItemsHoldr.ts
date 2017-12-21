import { IItemValue, IItemValueDefaults } from "./IItemValue";

/**
 * A container to hold ItemValue objects, keyed by name.
 */
export interface IItems {
    [i: string]: IItemValue;
}

/**
 * Settings to initialize a new instance of the IItemsHoldr interface.
 */
export interface IItemsHoldrSettings {
    /**
     * Initial settings for IItemValues to store.
     */
    values?: IItemValueDefaults;

    /**
     * Whether new items are allowed to be added (by default, true).
     */
    allowNewItems?: boolean;

    /**
     * Whether values should be saved immediately upon being set.
     */
    autoSave?: boolean;

    /**
     * A localStorage object to use instead of the global localStorage.
     */
    localStorage?: any;

    /**
     * A prefix to add before IItemsValue keys
     */
    prefix?: string;

    /**
     * Default attributes for IItemValues.
     */
    defaults?: IItemValueDefaults;
}

/**
 * A versatile container to store and manipulate values in localStorage.
 */
export interface IItemsHoldr {
    /**
     * @returns The values contained within, keyed by their keys.
     */
    getValues(): { [i: string]: IItemValue };

    /**
     * @returns Default attributes for values.
     */
    getDefaults(): IItemValueDefaults;

    /**
     * @returns A reference to localStorage or a replacment object.
     */
    getLocalStorage(): Storage;

    /**
     * @returns Whether this should save changes to localStorage automatically.
     */
    getAutoSave(): boolean;

    /**
     * @returns The prefix to store thigns under in localStorage.
     */
    getPrefix(): string;

    /**
     * @returns String keys for each of the stored IItemValues.
     */
    getKeys(): string[];

    /**
     * @returns All String keys of items.
     */
    getItemKeys(): string[];

    /**
     * @param key   The key for a known value.
     * @returns The known value of a key, assuming that key exists.
     */
    getItem(key: string): any;

    /**
     * @param key   The key for a known value.
     * @returns The settings for that particular key.
     */
    getObject(key: string): any;

    /**
     * @param key   The key for a potentially known value.
     * @returns Whether there is a value under that key.
     */
    hasKey(key: string): boolean;

    /**
     * @returns A mapping of key names to the actual values of all objects being stored.
     */
    exportItems(): any;

    /**
     * Adds a new key & value pair to by linking to a newly created ItemValue.
     *
     * @param key   The key to reference by new ItemValue by.
     * @param settings   The settings for the new ItemValue.
     * @returns The newly created ItemValue.
     */
    addItem(key: string, settings?: any): IItemValue;

    /**
     * Clears a value from the listing.
     *
     * @param key   The key of the value to remove.
     */
    removeItem(key: string): void;

    /**
     * Completely clears all values from the ItemsHoldr.
     */
    clear(): void;

    /**
     * Sets the value for the ItemValue under the given key.
     *
     * @param key   The key of the ItemValue.
     * @param value   The new value for the ItemValue.
     */
    setItem(key: string, value: any): void;

    /**
     * Increases the value for the ItemValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param key   The key of the ItemValue.
     * @param amount   The amount to increase by (by default, 1).
     */
    increase(key: string, amount?: number | string): void;

    /**
     * Increases the value for the ItemValue under the given key, via addition for
     * Numbers or concatenation for Strings.
     *
     * @param key   The key of the ItemValue.
     * @param amount   The amount to increase by (by default, 1).
     */
    decrease(key: string, amount?: number): void;

    /**
     * Toggles whether a value is true or false.
     *
     * @param key   The key of the ItemValue.
     */
    toggle(key: string): void;

    /**
     * Ensures a key exists in values. If it doesn't, and new values are
     * allowed, it creates it; otherwise, it throws an Error.
     *
     * @param key   Key of an ItemValue.
     */
    checkExistence(key: string): void;

    /**
     * Manually saves an item's value to localStorage, ignoring the autoSave flag.
     *
     * @param key   The key of the item to save.
     */
    saveItem(key: string): void;

    /**
     * Manually saves all values to localStorage, ignoring the autoSave flag.
     */
    saveAll(): void;
}
