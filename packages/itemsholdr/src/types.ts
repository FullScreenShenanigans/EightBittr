/**
 * Matched only by strings returned by keyof TItems.
 */
export type StringKeysOf<TItems> = keyof TItems & string;

/**
 * Called when an item equals an interesting value.
 *
 * @template TValue   Type of the item's value.
 * @param value   Interesting value of an item.
 */
export type ValueCallback<TValue = any> = (value: TValue) => void;

/**
 * Transforms an item's value.
 *
 * @template TValue   Type of the item's value.
 * @param value   Value of an item.
 * @returns Transformed value of the item.
 */
export type ValueTransform = <TValue = any>(value: TValue) => TValue;

/**
 * A mapping of item values to triggered callbacks.
 */
export interface Triggers {
    [i: string]: ValueCallback;
    [j: number]: ValueCallback;
}

/**
 * Settings for item values, keyed by item key.
 */
export interface ItemValues<TItems> {
    [i: string]: ItemSettings<TItems[any]>;
}

/**
 * Additional settings for storing an item.
 *
 * @type TItem  Type of the stored item.
 */
export interface ItemSettings<TItem = any> {
    /**
     * Maximum value the item may equal.
     */
    maximum?: number;

    /**
     * Callback for when the value reaches the maximum value.
     */
    onMaximum?: ValueCallback<number>;

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
    onModular?: ValueCallback<number>;

    /**
     * A mapping of values to callbacks that should be triggered when value
     * is equal to them.
     */
    triggers?: Triggers;

    /**
     * A default initial value to store, if value isn't provided.
     */
    valueDefault?: TItem;
}

/**
 * Settings to initialize a new instance of the ItemsHoldr class.
 *
 * @template TItems   Items names linked to their types.
 */
export interface ItemsHoldrSettings<TItems = any> {
    /**
     * Whether values should be saved immediately upon being set.
     */
    autoSave?: boolean;

    /**
     * Default attributes for item values.
     */
    defaults?: ItemSettings<TItems>;

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
    values?: ItemValues<TItems>;
}
