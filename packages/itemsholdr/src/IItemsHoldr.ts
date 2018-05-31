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
export interface IItemValues<TItems> {
    [i: string]: IItemSettings<TItems[any]>;
}

/**
 * Additional settings for storing an item.
 *
 * @type TItem  Type of the stored item.
 */
export interface IItemSettings<TItem = any> {
    /**
     * Maximum value the item may equal.
     */
    maximum?: number;

    /**
     * Callback for when the value reaches the maximum value.
     */
    onMaximum?: IValueCallback<number>;

    /**
     * Minimum value the item may equal.
     */
    minimum?: number;

    /**
     * Callback for when the value reaches the minimum value.
     */
    onMinimum?: Function;

    /**
     * Maximum number to modulo the value against.
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
    valueDefault?: TItem;
}

/**
 * Settings to initialize a new instance of the IItemsHoldr interface.
 *
 * @template TItems   Items names linked to their types.
 */
export interface IItemsHoldrSettings<TItems = any> {
    /**
     * Whether values should be saved immediately upon being set.
     */
    autoSave?: boolean;

    /**
     * Default attributes for item values.
     */
    defaults?: IItemSettings<TItems>;

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
    values?: IItemValues<TItems>;
}

/**
 * Cache-based wrapper around localStorage.
 *
 * @template TItems   Items names linked to their types.
 */
export interface IItemsHoldr<TItems = any> {
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
    key(index: number): keyof TItems;

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
     * @template TKey   Key name of an item.
     * @param key   Unique key to store the item under.
     * @param settings   Any additional settings for the item.
     */
    addItem<TKey extends keyof TItems>(key: TKey, settings?: IItemSettings<TItems[TKey]>): void;

    /**
     * Gets a value under a key.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @returns The known value of a key, assuming that key exists.
     */
    getItem<TKey extends keyof TItems>(key: TKey): TItems[TKey];

    /**
     * Clears a value from the listing.
     *
     * @template TKey   Key name of an item.
     * @param key   The key of the value to remove.
     */
    removeItem<TKey extends keyof TItems>(key: TKey): void;

    /**
     * Sets the value for an item under the given key.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param value   The new value for the item.
     */
    setItem<TKey extends keyof TItems>(key: TKey, value: TItems[TKey]): void;

    /**
     * Increases the value of an item as a number or string.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    increase<TKey extends keyof TItems>(key: TKey, amount?: number | string): void;

    /**
     * Decreases the value of an item as a number.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     * @param amount   Amount to increase by (by default, 1).
     */
    decrease<TKey extends keyof TItems>(key: TKey, amount?: number): void;

    /**
     * Toggles whether an item is true or false.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item.
     */
    toggle<TKey extends keyof TItems>(key: TKey): void;

    /**
     * Gets whether an item exists under the key.
     *
     * @template TKey   Key name of an item.
     * @param key   The key for a potentially known value.
     * @returns Whether there is a value under that key.
     */
    hasKey<TKey extends keyof TItems>(key: TKey): boolean;

    /**
     * Gets a summary of keys and their values.
     *
     * @returns A mapping of keys to their stored values.
     */
    exportItems(): TItems;

    /**
     * Completely clears all items.
     */
    clear(): void;

    /**
     * Manually saves an item's value to storage, ignoring autoSave settings.
     *
     * @template TKey   Key name of an item.
     * @param key   Key of an item to save.
     */
    saveItem<TKey extends keyof TItems>(key: TKey): void;

    /**
     * Manually saves all items to storage, ignoring autoSave settings.
     */
    saveAll(): void;

    /**
     * Manually resets all items to their storage defaults.
     */
    resetAll(): void;
}
