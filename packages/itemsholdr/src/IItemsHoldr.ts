/**
 * Called when an item equals an interesting value.
 *
 * @template TValue   Type of the item's value.
 * @param value   Interesting value of an item.
 */
export type IValueCallback<TValue = any> = (value: TValue) => void;

/**
 * Transforms an item's value.
 *
 * @template TValue   Type of the item's value.
 * @param value   Value of an item.
 * @returns Transformed value of the item.
 */
export type IValueTransform = <TValue = any>(value: TValue) => TValue;

/**
 * A mapping of item values to triggered callbacks.
 */
export interface ITriggers {
    [i: string]: IValueCallback;
    [j: number]: IValueCallback;
}

/**
 * Settings for item values, keyed by item key.
 */
export interface IItemValues {
    [i: string]: IItemSettings;
}

/**
 * Additional settings for storing an item.
 */
export interface IItemSettings {
    /**
     * Maximum value the item may equal if a number.
     */
    maximum?: number;

    /**
     * Callback for when the value reaches the maximum value.
     */
    onMaximum?: IValueCallback<number>;

    /**
     * Minimum value the item may equal if a number.
     */
    minimum?: number;

    /**
     * Callback for when the value reaches the minimum value.
     */
    onMinimum?: Function;

    /**
     * Maximum number to modulo the value against if a number.
     */
    modularity?: number;

    /**
     * Callback for when the value reaches modularity.
     */
    onModular?: IValueCallback<number>;

    /**
     * A mapping of values to callbacks that should be triggered when value
     * is equal to them.
     */
    triggers?: ITriggers;

    /**
     * A default initial value to store, if value isn't provided.
     */
    valueDefault?: any;
}

/**
 * Full export of stored items.
 */
export interface IExportedItems {
    [i: string]: string;
}

/**
 * Settings to initialize a new instance of the IItemsHoldr interface.
 */
export interface IItemsHoldrSettings {
    /**
     * Whether values should be saved immediately upon being set.
     */
    autoSave?: boolean;

    /**
     * Default attributes for item values.
     */
    defaults?: IItemSettings;

    /**
     * Prefix to add before keys in storage.
     */
    prefix?: string;

    /**
     * Storage object to use instead of the global localStorage.
     */
    storage?: Storage;

    /**
     * Initial settings for item values to store.
     */
    values?: IItemValues;
}

/**
 * A versatile container to store and manipulate values in localStorage.
 */
export interface IItemsHoldr {
    /**
     * How many items are being stored.
     */
    readonly length: number;

    /**
     * Gets the key at an index.
     *
     * @param index   An index for a key.
     * @returns The indexed key.
     */
    key(index: number): string;

    /**
     * Gets whether autoSave is enabled.
     *
     * @returns Whether autoSave is enabled.
     */
    getAutoSave(): boolean;

    /**
     * Sets whether autoSave is enabled.
     *
     * @param autoSave   Whether autoSave is enabled.
     */
    setAutoSave(autoSave: boolean): void;

    /**
     * Creates a new item with settings.
     *
     * @param key   Unique key to store the item under.
     * @param settings   Any additional settings for the item.
     */
    addItem(key: string, settings?: IItemSettings): void;

    /**
     * Gets a value under a key.
     *
     * @param key   Key of an item.
     * @returns The known value of a key, assuming that key exists.
     */
    getItem(key: string): any;

    /**
     * Clears a value from the listing.
     *
     * @param key   The key of the value to remove.
     */
    removeItem(key: string): void;

    /**
     * Sets the value for an item under the given key.
     *
     * @param key   Key of an item.
     * @param value   The new value for the item.
     */
    setItem(key: string, value: any): void;

    /**
     * Increases the value of an item as a number or string.
     *
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    increase(key: string, amount?: number | string): void;

    /**
     * Decreases the value of an item as a number.
     *
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    decrease(key: string, amount?: number): void;

    /**
     * Toggles whether an item is true or false.
     *
     * @param key   Key of an item.
     */
    toggle(key: string): void;

    /**
     * Gets whether an item exists under the key.
     *
     * @param key   The key for a potentially known value.
     * @returns Whether there is a value under that key.
     */
    hasKey(key: string): boolean;

    /**
     * Gets a summary of keys and their values.
     *
     * @returns A mapping of keys to their stored values.
     */
    exportItems(): IExportedItems;

    /**
     * Completely clears all items.
     */
    clear(): void;

    /**
     * Manually saves an item's value to storage, ignoring autoSave settings.
     *
     * @param key   Key of an item to save.
     */
    saveItem(key: string): void;

    /**
     * Manually saves all items to storage, ignoring autoSave settings.
     */
    saveAll(): void;
}
